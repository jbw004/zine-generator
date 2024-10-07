import React from 'react';
import { useAuth } from '../AuthContext';

function RightPanel({ selectedText, onTextStyleChange }) {
  const { user, login, logout } = useAuth();

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      login();
    }
  };

  const handleViewGallery = () => {
    if (user) {
      const galleryUrl = `/gallery/${user.uid}`;
      window.open(galleryUrl, '_blank');
    }
  };

  return (
    <div className="floating-panel right-panel">
      <div className="auth-buttons">
        <button onClick={handleAuthAction} className="auth-button">
          {user ? 'Logout' : 'Login'}
        </button>
        {user && (
          <button onClick={handleViewGallery} className="view-gallery-button">
            View Gallery
          </button>
        )}
      </div>
      
      {selectedText ? (
        <>
          <h2>Text Properties</h2>
          <label>
            Font
            <select onChange={(e) => onTextStyleChange({ fontFamily: e.target.value })}>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier">Courier</option>
            </select>
          </label>
          <label>
            Size
            <input 
              type="number" 
              defaultValue={24} 
              onChange={(e) => onTextStyleChange({ fontSize: `${e.target.value}px` })}
            />
          </label>
          <label>
            Color
            <input 
              type="color" 
              defaultValue="#000000" 
              onChange={(e) => onTextStyleChange({ color: e.target.value })}
            />
          </label>
        </>
      ) : (
        <div>Select text to edit</div>
      )}
    </div>
  );
}

export default RightPanel;