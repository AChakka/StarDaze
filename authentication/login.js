import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://sagniks:12345@hacknc2024.coa7s.mongodb.net/?retryWrites=true&w=majority&appName=HackNC2024";
const client = new MongoClient(uri);

async function testConnection() {
    try {
        await client.connect();
        console.log('Connected successfully to server');   
    } catch (err) {
        console.error('Error:', err);
    } 
}

testConnection();

