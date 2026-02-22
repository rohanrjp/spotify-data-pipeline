import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function query(queryString: string, params: any[] = []) {
  try {
    const rows = await sql.query(queryString, params);
    
    return { rows };
  } catch (error) {
    console.error('Database Query Error:', error);
    throw error;
  }
}