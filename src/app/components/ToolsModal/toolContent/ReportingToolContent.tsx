import React from 'react'

function ReportingToolContent() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Report Issues & Request Features</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">GitHub Repository</h3>
        <p className="text-gray-700 mb-3">
          This application is open source and hosted on GitHub. You can report bugs, request features, 
          or contribute to the project by visiting our repository.
        </p>
        <a 
          href="https://github.com/consmit31/KATRINA" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Visit GitHub Repository →
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-3">🐛 Report a Bug</h3>
          <p className="text-gray-700 mb-3">
            Found something that isn&apos;t working correctly? Help us improve by reporting bugs.
          </p>
          <a 
            href="https://github.com/consmit31/KATRINA/issues/new?labels=bug&template=bug_report.md" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          >
            Report Bug
          </a>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3">💡 Request Feature</h3>
          <p className="text-gray-700 mb-3">
            Have an idea for a new feature or improvement? We&apos;d love to hear about it!
          </p>
          <a 
            href="https://github.com/consmit31/katrina_mkii/issues/new?labels=enhancement&template=feature_request.md" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
          >
            Request Feature
          </a>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 How to Submit an Issue</h3>
        <div className="space-y-2 text-gray-700">
          <p><strong>New to GitHub Issues?</strong> Don&apos;t worry! Here&apos;s how to get started:</p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Click one of the buttons above (Report Bug or Request Feature)</li>
            <li>You&apos;ll need a GitHub account - it&apos;s free to create one</li>
            <li>Fill out the issue template with as much detail as possible:
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li><strong>For bugs:</strong> Describe what happened, what you expected, and steps to reproduce</li>
                <li><strong>For features:</strong> Explain what you&apos;d like to see and why it would be useful</li>
              </ul>
            </li>
            <li>Add screenshots or examples if they help explain your issue</li>
            <li>Click Submit new issue&quot; when you&apos;re done</li>
          </ol>
          <p className="mt-3 text-sm text-gray-600">
            <strong>Tip:</strong> Be as specific as possible! The more details you provide, 
            the faster we can understand and address your issue.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">💬 General Questions?</h3>
        <p className="text-gray-700">
          For general questions or discussions about the project, you can also start a 
          <a 
            href="https://github.com/consmit31/KATRINA/discussions" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-yellow-700 underline hover:text-yellow-800"
          >
             GitHub Discussion
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default ReportingToolContent
