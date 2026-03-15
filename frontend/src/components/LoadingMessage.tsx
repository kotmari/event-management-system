

export const LoadingMessage = ({message}: {message: string}) => {
  return (
    <div className="flex justify-center p-10">
      <div className="animate-pulse text-gray-500">{message}</div>
    </div>
  )
}
