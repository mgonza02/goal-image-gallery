// ejecute javascript sleep and run in background
// This code snippet demonstrates how to create a sleep function in JavaScript that can be used to
// pause execution for a specified duration. The sleep function returns a Promise that resolves after the given time.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Example usage of the sleep function
async function runInBackground() {
  console.log("Starting background task...");
  
  // Sleep for 2000 milliseconds (2 seconds)
  await sleep(2000000);
  
  console.log("Background task completed after 2 seconds.");
}
// Start the background task
runInBackground().then(() => {
  console.log("All tasks completed.");
}).catch(error => {
  console.error("An error occurred:", error);
});