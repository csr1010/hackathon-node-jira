import { Router } from 'express';
import JiraClient from 'jira-client';
import dialogFlow from 'dialogflow';

export default () => {
    let api = Router();
    let issue = null;
    async function fetchFromJira(ticket_num) {
        // use oauth later
        let jira = await new JiraClient({
            protocol: 'https',
            host: 'jira.moat.com',
            username: 'chetan.jannu',
            password: 'Jcsr@1010',
            apiVersion: '2',
            strictSSL: true
        });

        try {
            issue = await jira.findIssue(ticket_num);
        } catch (err) {
            console.error(err);
        }

        return issue.fields;
    }

    api.get('/:ticket_num', (req, res) => {
        let fj = fetchFromJira(req.params.ticket_num);
        fj.then((data) => {
            let ticketData = {
                status: "",
                summary: "",
                description: "",
                priority: "",
                reporter: "",
                creator: "",
                components: "",
                labels: "",
                sprint: ""
            };

            ticketData.status = data.status.name;
            ticketData.summary = data.summary;
            //ticketData.description = data.description;
            ticketData.priority = data.priority.name;
            ticketData.reporter = data.reporter.displayName;
            ticketData.creator = data.creator.displayName;
            ticketData.sprint = data["customfield_10020"] ? data["customfield_10020"][0].match(/name=([^/",]*)/)[1] : "-";
            ticketData.components = data.components.reduce((a, b) => `${a} ${a ? "," : ""} ${b.name}`, "");
            ticketData.labels = data.labels.join(", ");

            res.json(ticketData);
        }).catch((err) => {
            res.json({
                "data": `something wrong ! ${req.params.ticket_num} ,  ${err}`
            });
        })
    });

    return api;
}
