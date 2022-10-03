import { authenticate } from '@google-cloud/local-auth';
import { promises as fs } from 'fs';
import { BaseExternalAccountClient, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import path from 'path';
import process from 'process';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const WRITING_PATH = path.join(process.cwd(), 'writing.json');

/**
 * @see https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}
 */
const SPREADSHEET_ID = '1iYQ3sOOCGFPigtakcpfui0wLUsXwWfqS9TmpUgpiuQY';
const SHEET_1 = 'シート1';
const LINT_COLUMN = 'A';
const LINT_COLUMN_ARRAY_INDEX = 0;
//const OK_COLUMN = 'B';
const OK_COLUMN_ARRAY_INDEX = 1;
// const NG_COLUMN = 'C';
const NG_COLUMN_ARRAY_INDEX = 2;
const IGNORE_COLUMN = 'D';
const IGNORE_COLUMN_ARRAY_INDEX = 3;

async function loadSavedCredentialsIfExistFromTokenJSON() {
  try {
    const content = await fs.readFile(TOKEN_PATH, { encoding: 'utf-8' });
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: OAuth2Client) {
  const content = await fs.readFile(CREDENTIALS_PATH, { encoding: 'utf-8' });
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  const tokenJSONClient = await loadSavedCredentialsIfExistFromTokenJSON();
  if (tokenJSONClient) {
    return tokenJSONClient;
  }
  const client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function listMajors(auth: BaseExternalAccountClient | OAuth2Client) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const sheetIdsBySheetTitle: any = {};
  const sheetProperties = spreadsheet.data.sheets;
  sheetProperties &&
    sheetProperties.forEach((p) => {
      const properties = p.properties;
      if (!properties) return;

      const title = properties.title;
      if (!title) return;

      sheetIdsBySheetTitle[title] = properties.sheetId;
    });

  const sheet1 = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_1}!${LINT_COLUMN}:${IGNORE_COLUMN}`,
  });
  const sheet1Rows = sheet1.data.values;

  const writtingJSON: any = {};
  sheet1Rows &&
    sheet1Rows.forEach((row, i) => {
      const lint = row[LINT_COLUMN_ARRAY_INDEX];
      const ok = row[OK_COLUMN_ARRAY_INDEX];
      const ng = row[NG_COLUMN_ARRAY_INDEX];
      const ignore = row[IGNORE_COLUMN_ARRAY_INDEX];

      if (lint !== '済' && lint !== '対応中') return;
      if (!ok || !ng) return;

      const rowIndex = i + 1;

      writtingJSON[ng] = {
        ok,
        ignore: ignore ? ignore : '',
        url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${sheetIdsBySheetTitle[SHEET_1]}&range=${rowIndex}:${rowIndex}`,
      };
    });

  console.log(writtingJSON);
  const prettifyJSONStringify = JSON.stringify(writtingJSON, null, 2);
  await fs.writeFile(WRITING_PATH, prettifyJSONStringify);
}

authorize().then(listMajors).catch(console.error);
