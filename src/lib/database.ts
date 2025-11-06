const API_KEY = process.env.PIPILOT_API_KEY!;
const DATABASE_ID = process.env.NEXT_PUBLIC_PIPILOT_DATABASE_ID!;
const BASE_URL = 'https://pipilot.dev/api/v1';

export async function getRecords(tableId: string) {
  const response = await fetch(
    `${BASE_URL}/databases/${DATABASE_ID}/tables/${tableId}/records`,
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch records');
  }

  return response.json();
}

export async function createRecord(tableId: string, data: any) {
  const response = await fetch(
    `${BASE_URL}/databases/${DATABASE_ID}/tables/${tableId}/records`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create record');
  }

  return response.json();
}

export async function updateRecord(tableId: string, recordId: string, data: any) {
  const response = await fetch(
    `${BASE_URL}/databases/${DATABASE_ID}/tables/${tableId}/records/${recordId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update record');
  }

  return response.json();
}

export async function deleteRecord(tableId: string, recordId: string) {
  const response = await fetch(
    `${BASE_URL}/databases/${DATABASE_ID}/tables/${tableId}/records/${recordId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete record');
  }

  return response.json();
}