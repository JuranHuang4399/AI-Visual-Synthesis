import { testAPI } from "../services/api.js";

async function runTest() {
  console.log("Running API Test...");
  const result = await testAPI("http://127.0.0.1:5000");
  console.log("Response:", result);
}

runTest();
