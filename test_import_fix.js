// Quick test to verify the import fix
const fs = require('fs');
const path = require('path');

// Read the fixed test data
const testDataPath = path.join(__dirname, 'tests/test-data/test_import1.json');
const rawData = fs.readFileSync(testDataPath, 'utf-8');

try {
    const data = JSON.parse(rawData);
    
    console.log('JSON is valid!');
    console.log(`Total Issues: ${data.totalIssues}`);
    console.log(`Total Templates: ${data.totalTemplates}`);
    console.log(`Actual Issues Count: ${data.issues.length}`);
    console.log(`Actual Templates Count: ${data.templates.length}`);
    
    // Check for issue/template mismatches
    const issueNames = data.issues.map(i => i.name);
    console.log('\nIssue Names:', issueNames);
    
    const templatesWithMissingIssues = data.templates.filter(t => 
        !issueNames.includes(t.issue)
    );
    
    if (templatesWithMissingIssues.length > 0) {
        console.log('\n❌ Templates with missing issues:');
        templatesWithMissingIssues.forEach(t => 
            console.log(`  - Template "${t.name}" references issue "${t.issue}"`)
        );
    } else {
        console.log('\n✅ All templates reference valid issues');
    }
    
    // Check template names in issues
    const allTemplateNamesInIssues = data.issues.flatMap(i => i.templateNames);
    const actualTemplateNames = data.templates.map(t => t.name);
    
    const missingTemplates = allTemplateNamesInIssues.filter(name => 
        !actualTemplateNames.includes(name)
    );
    
    if (missingTemplates.length > 0) {
        console.log('\n❌ Issue references to missing templates:');
        missingTemplates.forEach(name => 
            console.log(`  - Missing template: "${name}"`)
        );
    } else {
        console.log('✅ All template names in issues have corresponding templates');
    }
    
} catch (error) {
    console.error('❌ JSON parsing failed:', error.message);
}