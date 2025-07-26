import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <SignUp 
        appearance={{
          variables: {
            colorBackground: '#ffffff',
            colorPrimary: '#7c3aed',
            colorText: '#374151',
            colorTextSecondary: '#6b7280',
            colorInputBackground: '#ffffff',
            colorInputText: '#374151',
            fontFamily: 'system-ui, sans-serif'
          },
          elements: {
            rootBox: 'bg-white',
            card: 'bg-white shadow-lg border border-gray-200',
            headerTitle: 'text-gray-900',
            headerSubtitle: 'text-gray-600',
            formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
            formFieldInput: 'border-gray-300 focus:border-purple-500 focus:ring-purple-500',
            footerActionLink: 'text-purple-600 hover:text-purple-700'
          }
        }}
        signInUrl="/sign-in"
        forceRedirectUrl="/personal-info"
      />
    </div>
  )
}