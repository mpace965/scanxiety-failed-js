# scanxiety-failed-js

A disposable JavaScript repository for manually checking SonarQube Cloud automatic-analysis recovery. It starts with an intentionally invalid source directory, while the JavaScript itself runs normally.

```bash
npm start
```

No dependencies, build step, scanner workflow, or tests are needed. The example is a small in-memory shop with catalog, cart, checkout, and receipt code.

## Seed a failed automatic analysis

1. Publish this repository with its initial `.sonarcloud.properties` unchanged:

   ```properties
   sonar.sources=missing-directory
   sonar.sourceEncoding=UTF-8
   ```

2. Import the repository into the SonarQube Cloud organization bound to the GitHub account. Grant the SonarQube Cloud GitHub App access to the repository if needed. Use a normal project binding and automatic analysis.
3. Wait for the first analysis to fail. Verify the failure is an analysis/configuration error, and that the project has **zero successful analyses**. Save its analysis/task ID. If the scan succeeds or the project is ineligible, stop and investigate before relying on this fixture.

The configuration file and `sonar.sources` are supported for [automatic analysis](https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/automatic-analysis). The [troubleshooting guide](https://docs.sonarsource.com/sonarqube-cloud/appendices/troubleshooting) describes source-directory and invalid-regex failures. The exact `missing-directory` recipe has not yet been validated on a live project.

## Move the fault to a setting repairable without pushing

1. In project **Administration → General Settings → Analysis Scope**, add an **Ignore Issues on Files** entry containing the invalid regular expression `[` and save it. If Cloud rejects the value, this particular recipe cannot be used as written; do not assume the setting was saved.
2. In the published repository's local copy, change `.sonarcloud.properties` to:

   ```properties
   sonar.sources=src
   sonar.sourceEncoding=UTF-8
   ```

3. Commit and push while the server-side setting remains invalid:

   ```bash
   git add .sonarcloud.properties
   git commit -m "Use valid sources while retaining the project setting failure"
   git push origin main
   ```

4. Wait for another configuration failure and record its new analysis/task ID. Verify there are still zero successful analyses. You now have a valid source commit with a fault that can be repaired in Cloud without another push.

## Exercise retry

- **Repeat failure:** leave the invalid regex saved, click Retry, and verify a distinct new analysis/task ID followed by another failure. Repeated eligibility responses alone do not prove that a retry started an analysis.
- **Recover successfully:** remove the invalid regex entry in Cloud, save, then click Retry **without pushing**. Observe a distinct new analysis/task ID, progress, and successful completion.
- **Stale failure:** retain the original failure ID while a new analysis begins and ensure the UI follows the new analysis.
- **Duplicate clicks:** throttle the browser connection and click Retry twice; observe requests and analysis IDs.

Verify `/api/autoscan/eligibility?ignoreCache=true&autoEnable=true` schedules a new analysis on the unchanged commit for an already-enabled failed project. This backend behavior is an open validation point. If no new analysis starts, keep that observation separate from whether the repository is eligible.

After successful recovery, use a fresh numbered repository/project for another run of the zero-success tutorial state. Removing the GitHub repository does not clean up its SonarQube Cloud project; remove that project separately.
