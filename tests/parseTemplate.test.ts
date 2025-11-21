import parseTemplate from "../src/app/utils/parseTemplate";
import { describe, expect, test } from '@jest/globals'
import * as fs from 'fs';
import * as path from 'path';

// Read test data from external files (not tracked by git)
const smartDevKba = fs.readFileSync(path.join(__dirname, '../test-data/smart-device-kba.txt'), 'utf8');
const miLoginKba = fs.readFileSync(path.join(__dirname, '../test-data/mi-login-kba.txt'), 'utf8');
const pwKba = fs.readFileSync(path.join(__dirname, '../test-data/pw-kba.txt'), 'utf8');

describe("parseTemplate Tests", () => {
    test("Smart device KBA parsing", () => {
        const parsed = parseTemplate(smartDevKba);

        expect(parseTemplate(smartDevKba)).toEqual({
            issue: '',
            name: '',
            kba: '',
            fields: [
                {
                    label: "Best contact method – Email, MS Teams, or Phone number#",
                    type: "text",
                },
                {
                    label: "Can you access email on your state computer (Yes or No)",
                    type: "selector",
                    options: ["Y", "N"]
                },
                {
                    label: "Work Days/Hours",
                    type: "text",
                },
                {
                    label: "Location: (State office / offsite / home)",
                    type: "selector",
                    options: ["State office", "offsite", "home"]
                },
                {
                    label: "Employee UserID",
                    type: "text",
                },
                {
                    label: "Device Phone Number",
                    type: "text",
                },
                {
                    label: "Device Type",
                    type: "text",
                },
                {
                    label: "Carrier",
                    type: "text",
                },
                {
                    label: "Manufacturer",
                    type: "text",
                },
                {
                    label: "Personal or State-Issued",
                    type: "selector",
                    options: ["Personal", "State-Issued"]
                },
                {
                    label: "Serial Number",
                    type: "text",
                },
                {
                    label: "IMEI",
                    type: "text",
                },
                {
                    label: "IMEI2 (if assigning to another team)",
                    type: "text",
                },
                {
                    label: "Issue",
                    type: "text",
                },
            ]
        })
    });

    test("MI Login KBA parsing", () => {
        expect(parseTemplate(miLoginKba)).toEqual({
            issue: '',
            name: '',
            kba: '',
            fields: [
                {
                    label: "User type (Worker/For Business/Citizen)",
                    type: "selector",
                    options: ["Worker", "For Business", "Citizen"]
                },
                {
                    label: "Browser client is using",
                    type: "text",
                },
                {
                    label: "URL client is using",
                    type: "text",
                },
                {
                    label: "Agency",
                    type: "text",
                },
                {
                    label: "Application client is trying to access",
                    type: "text",
                },
                {
                    label: "PIN verified or Questions Answered",
                    type: "text",
                },
                {
                    label: "Name",
                    type: "text",
                },
                {
                    label: "UserID",
                    type: "text",
                },
                {
                    label: "Phone",
                    type: "text",
                },
                {
                    label: "Email",
                    type: "text",
                },
                {
                    label: "Issue",
                    type: "text",
                },
            ]
        })
    });

    test("Password KBA parsing", () => {
        expect(parseTemplate(pwKba)).toEqual({
            issue: '',
            name: '',
            kba: '',
            fields: [
                {
                    label: "Issue",
                    type: "text",
                },
            ]
        })
    });
});