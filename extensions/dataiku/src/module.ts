import { createExtension } from "@cognigy/extension-tools";

/* import all nodes */
import { createProjectNode } from "./nodes/createProject";
import { jobStatusNode } from "./nodes/jobStatus";
import { listlatestJobsNode } from "./nodes/listlatestJobs";
import { listProjectsNode } from "./nodes/listProjects";

/* import all connections */
import { dataikuConnection } from "./connections/dataikuConnection";

export default createExtension({

    nodes: [
        createProjectNode,
        jobStatusNode,
        listlatestJobsNode,
        listProjectsNode,
    ],

    connections: [
        dataikuConnection
    ]

});