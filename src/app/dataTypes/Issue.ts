import IssueMetric from "./IssueMetric";

interface Issue {
    name: string;
    templateNames: string[];
    metrics: IssueMetric;
}

export default Issue;