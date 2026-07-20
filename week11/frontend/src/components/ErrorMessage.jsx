function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-banner">
      <h3>⚠️ Connection Error</h3>
      <p>{message}</p>
      <button className="btn btn-secondary" onClick={onRetry}>
        Retry
      </button>
      <details className="error-details">
        <summary>Troubleshooting Guide</summary>
        <ul>
          <li>✓ Is the backend server running on port 5000?</li>
          <li>✓ Is CORS configured correctly in server.js?</li>
          <li>✓ Is MongoDB connected?</li>
          <li>✓ Check browser console for detailed errors</li>
        </ul>
      </details>
    </div>
  );
}

export default ErrorMessage;
