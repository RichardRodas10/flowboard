interface AuthHeaderProps {
    showSlogan?: boolean
  }
  
  export function AuthHeader({ showSlogan = false }: AuthHeaderProps) {
    return (
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Flow<span className="text-primary-500">Board</span>
        </h1>
        {showSlogan && (
          <p className="text-gray-500 text-xs">
            Where tasks flow seamlessly
          </p>
        )}
      </div>
    )
  }