# Import/Export Functionality Documentation

## Overview
The KATRINA application now supports comprehensive import and export functionality for issues and templates, with both legacy and enhanced metadata formats.

## Export Functionality

### Export Options
1. **Download Issues** - Exports only issues data with metadata
2. **Download Templates** - Exports only templates data with metadata  
3. **Download All** - Exports both issues and templates in a single file

### Export Format
All exports include metadata and are structured as follows:

#### Individual Exports
```json
{
  "exportDate": "2025-11-23T15:30:00.000Z",
  "totalIssues": 5,
  "issues": [...]
}
```

```json
{
  "exportDate": "2025-11-23T15:30:00.000Z", 
  "totalTemplates": 15,
  "templates": [...]
}
```

#### Combined Export
```json
{
  "exportDate": "2025-11-23T15:30:00.000Z",
  "totalIssues": 5,
  "totalTemplates": 15,
  "issues": [...],
  "templates": [...]
}
```

## Import Functionality

### Import Modes
1. **Separate Files Mode** - Import issues and templates from separate files
2. **Combined File Mode** - Import from a single combined export file

### Supported Formats
The import functionality supports both:

#### Legacy Format (Backward Compatible)
Direct JSON arrays without metadata:
```json
[
  {
    "name": "Issue Name",
    "templateNames": ["Template 1", "Template 2"]
  }
]
```

#### Export Format (With Metadata)
Objects containing metadata and data arrays:
```json
{
  "exportDate": "2025-11-23T15:30:00.000Z",
  "totalIssues": 1,
  "issues": [
    {
      "name": "Issue Name", 
      "templateNames": ["Template 1", "Template 2"]
    }
  ]
}
```

### Validation Features
- **Format Detection** - Automatically detects legacy vs export format
- **Data Validation** - Validates JSON structure and required fields
- **Reference Validation** - Ensures template names in issues match actual templates
- **Issue Matching** - Verifies templates reference correct issue names
- **Duplicate Handling** - Skips existing items to avoid duplicates

## Test Data

### Comprehensive Test Files
The system includes extensive test data covering:

#### Legacy Format Files
- `issues-basic.txt`
- `templates-basic.txt`
- `issues-comprehensive.txt`
- `templates-comprehensive.txt`
- `issues-extended.txt`
- `templates-extended.txt`
- `issues-minimal.txt`
- `templates-minimal.txt`

#### Export Format Files
- `issues-export-format.json` - Issues with metadata (6 issues)
- `templates-export-format.json` - Templates with metadata (18 templates)
- `combined-export-complete.json` - Complete combined export

#### Edge Case Files
- `issues-empty-export.json` - Empty export with metadata
- `templates-empty-export.json` - Empty export with metadata
- `combined-export-invalid-references.json` - Invalid template references
- `combined-export-malformed.json` - Malformed export structure

### Test Coverage
The test suite includes:
- **Legacy Format Tests** - Backward compatibility validation
- **Export Format Tests** - New format parsing and validation
- **Validation Function Tests** - Individual validation function testing
- **Edge Cases** - Error handling and malformed data
- **Data Integrity** - Template/issue relationship validation

## Error Handling

### Import Errors
- **Invalid JSON** - Handles malformed JSON gracefully
- **Missing Fields** - Validates required fields exist
- **Reference Mismatches** - Detects template/issue name mismatches
- **Format Errors** - Clear error messages for format issues

### Export Errors
- **Empty Data** - Handles cases with no data to export
- **File Generation** - Proper error handling for file creation

## Usage Examples

### Export Usage
```typescript
// Export issues only
const exportIssuesData = {
  exportDate: new Date().toISOString(),
  totalIssues: issues.length,
  issues: issues
};

// Export combined data
const exportAllData = {
  exportDate: new Date().toISOString(), 
  totalIssues: issues.length,
  totalTemplates: templates.length,
  issues: issues,
  templates: templates
};
```

### Import Usage
```typescript
// Import separate files
const { issues, templates } = parseInput(issueText, templateText);

// Import combined file
const { issues, templates } = parseCombinedImport(combinedText);

// Extract data (format-agnostic)
const { issues, templates } = extractDataFromFiles(issueText, templateText);
```

## File Naming Convention
- Issues exports: `issues-export-YYYY-MM-DD.json`
- Templates exports: `templates-export-YYYY-MM-DD.json`
- Combined exports: `complete-export-YYYY-MM-DD.json`

## Migration Path
1. **Legacy users** can continue using existing file formats
2. **New exports** automatically include metadata
3. **Mixed imports** are supported (legacy + export formats)
4. **Validation** ensures data integrity across formats

This comprehensive import/export system provides flexibility, backward compatibility, and robust error handling while maintaining data integrity throughout the process.