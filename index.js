import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

const initializeRepo = async (initDate) => {
    try {
      await git.init();
      
      // Check if the remote already exists
      const remotes = await git.getRemotes();
      const remoteExists = remotes.some(remote => remote.name === "origin");
  
      if (!remoteExists) {
        await git.addRemote("origin", "https://github.com/akashcry/myrepojs.git");
      } else {
        console.log("Remote 'origin' already exists, skipping addition.");
      }
  
      const formattedDate = moment(initDate).format();
      const data = { date: formattedDate };
  
      await jsonfile.writeFile(path, data);
      await git.add([path]).commit("Initial commit", { "--date": formattedDate });
      await git.push("origin", "main", { "--set-upstream": null });
  
      console.log("Repository initialized and pushed with initial commit.");
    } catch (error) {
      console.error("Error initializing repository:", error);
    }
  };
const markCommit = (x, y) => {
  const date = moment().subtract(1, "y").add(1, "d").add(x, "w").add(y, "d").format();
  const data = { date: date };

  jsonfile.writeFile(path, data, () => {
    git.add([path]).commit(date, { "--date": date }).push();
  });
};

const makeCommits = (n) => {
  if (n === 0) return git.push();
  const x = random.int(0, 54);
  const y = random.int(0, 6);
  const date = moment().subtract(1, "y").add(1, "d").add(x, "w").add(y, "d").format();

  const data = { date: date };
  console.log(date);
  jsonfile.writeFile(path, data, () => {
    git.add([path]).commit(date, { "--date": date }, makeCommits.bind(this, --n));
  });
};

// Sample usage:
// Replace "2023-01-01" with your desired initialization date
// Replace "<your-repo-url>" with your actual remote repository URL
// Run the function below to initialize the repository

// initializeRepo("2023-01-01");
makeCommits(500);
