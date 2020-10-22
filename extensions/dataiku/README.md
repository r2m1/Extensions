# Dataiku Commands

This Extension integrates Cognigy with the [Dataiku API](https://doc.dataiku.com/dss/api/8.0/rest) and performs project and job control tasks.

**Connection:**

- domain: Hosted domain path for your Dataiku instance
    - Please include the http(s):// and final / at the end of the path
- USER_API_KEY: API Key Secret

## Node: Create Project

This node creates a project in Dataiku as per the details entered in the node settings:

- Project Folder Id
- Project key
- Name
- Owner
- [API Source](https://doc.dataiku.com/dss/api/8.0/rest/#projects-projects-post)

## Node: Get Job Status

This node returns the job status for a job in Dataiku as per the details entered in the node settings:

- Project Key
- Job Id
- [API Source](https://doc.dataiku.com/dss/api/8.0/rest/#jobs-job-get)

## Node: List Latest Jobs

This node returns a list of the latest jobs in Dataiku as per the details entered in the node settings:

- Project Key
- Limit
- [API Source](https://doc.dataiku.com/dss/api/8.0/rest/#jobs-jobs-get)

## Node: List Projects

This node returns a list of projects in Dataiku as per the details entered in the node settings:

- tags
- [API Source](https://doc.dataiku.com/dss/api/8.0/rest/#projects-projects-get)


# Helpful Links

- Dataiku REST API Documentation
  - [V2 Api Specifications](https://doc.dataiku.com/dss/api/8.0/rest)