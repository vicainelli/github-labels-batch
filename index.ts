import { Octokit } from "@octokit/core";

// * reading labels from labels.json
const file = Bun.file("labels.json");
const labels = await file.json();

// * creating octokit instance
const octokit = new Octokit({
	auth: Bun.env.GH_TOKEN,
});

async function addingLabel(name: string, description: string, color: string) {
	await octokit.request("POST /repos/{owner}/{repo}/labels", {
		owner: Bun.env.GH_OWNER || "",
		repo: Bun.env.GH_REPO || "",
		name,
		description,
		color,
		headers: {
			"X-GitHub-Api-Version": Bun.env.X_GITHUB_API_VERSOIN,
		},
	});
}

// * loop through labels and create them one by one
for (const label of labels) {
	await addingLabel(label.name, label.description, label.color)
		.then(() => {
			console.log(`Label ${label.name} created!`);
		})
		.catch((err) => {
			console.log(err);
		});
}
