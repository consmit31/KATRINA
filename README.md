# KATRINA

**A powerful template management tool for streamlining repetitive documentation and form-filling tasks.**

> 🔒 **Privacy First**: All data is stored locally in your browser using IndexedDB. No external databases or servers are used.

## Overview

KATRINA is a Next.js-based web application designed to help users create, manage, and fill out predefined templates efficiently. Whether you're handling support tickets, generating reports, or managing standardized documentation, KATRINA provides an intuitive interface to streamline your workflow.

## Key Features

### 📝 Template Management

- **Create Custom Templates**: Build templates with various field types (text inputs, dropdowns)
- **Parse Template Text**: Automatically convert structured text into interactive templates
- **Organize by Issues**: Group templates under specific issue categories
- **Knowledge Base Articles (KBA)**: Associate helpful information with each template

### 🎯 Smart Form Filling

- **Dynamic Forms**: Templates generate interactive forms automatically
- **Field Validation**: Built-in validation ensures data completeness
- **Real-time Updates**: See your template output as you fill in fields
- **Keyboard Shortcuts**: Efficient navigation and quick actions

### 🔧 Powerful Tools

- **Import/Export**: Backup and share your templates and data
- **Bulk Operations**: Manage multiple templates simultaneously  
- **View All**: Browse and edit existing templates and issues
- **Reporting**: Generate business requirement and functional requirement documents

### 🎨 Modern Interface

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Theme**: Customizable appearance
- **Intuitive Navigation**: Clean, user-friendly interface
- **Real-time Feedback**: Visual indicators for validation and status



## How to Use

### Creating Your First Template

1. **Open the New Template Modal**
   - Click the "+" button or use keyboard shortcut
   - Or press the designated hotkey for quick access

2. **Define Your Template**

   ```text
   Issue: Login Problem
   Name: Password Reset Procedure
   KBA: Steps to help user reset their password
   
   Field: Username [text]
   Field: Email Address [text]
   Field: Reset Method [selector]
   ```

3. **Configure Fields**
   - Review and modify parsed fields
   - Add custom options for selector fields
   - Set default values if needed

4. **Save and Use**
   - Create the template
   - Select it from the issue selector
   - Fill out the generated form

### Managing Templates

- **View All Templates**: Use the Tools modal to see all your templates
- **Edit Existing**: Modify templates directly from the view interface
- **Import/Export**: Backup your templates or share with others
- **Organize**: Group related templates under issue categories

## Technical Architecture

### Built With

- **Next.js 15.4.5** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **IndexedDB** - Local data storage

### Data Storage

All application data is stored locally in your browser using IndexedDB:

- **Templates**: Your custom template definitions
- **Issues**: Issue categories and associated templates
- **Form Data**: Current form state and values
- **Settings**: User preferences and configuration

**No data is ever sent to external servers or databases.**

## Keyboard Shortcuts

| Action | Shortcut | Description |
|--------|----------|-------------|
| New Template | `Ctrl/Cmd + N` | Open new template modal |
| Tools | `Ctrl/Cmd + T` | Open tools modal |
| Reset Template | `Ctrl/Cmd + R` | Clear current template selection |

## Development

### Project Structure

```text
src/
├── app/
│   ├── components/          # React components
│   ├── dataTypes/          # TypeScript interfaces
│   ├── hooks/              # Custom React hooks
│   ├── redux/              # State management
│   └── utils/              # Utility functions
│       └── indexedDB/      # Database operations
├── test-data/              # Sample data for testing
└── tests/                  # Test suites
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests

### Testing

The project includes comprehensive test coverage:

- Unit tests for utility functions
- Component testing with React Testing Library
- Template parsing and validation tests

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Privacy & Security

- **Local Storage Only**: All data remains on your device
- **No Tracking**: No analytics or user tracking implemented
- **Offline Capable**: Works without internet connection
- **Secure**: No external dependencies for data storage

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Refer to the in-app help documentation

---

**KATRINA** - Making template management simple, secure, and efficient.
