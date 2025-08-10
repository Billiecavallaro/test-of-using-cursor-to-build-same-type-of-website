// Terminal functionality
function logToTerminal(message, type = 'interaction') {
    const terminalOutput = document.getElementById('terminal-output');
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    // Remove the cursor line
    const cursorLine = terminalOutput.querySelector('.terminal-line:last-child');
    if (cursorLine && cursorLine.querySelector('.cursor')) {
        cursorLine.remove();
    }
    
    // Add new log entry
    const logLine = document.createElement('div');
    logLine.className = `terminal-line ${type}-log`;
    logLine.innerHTML = `[${timestamp}] ${message}`;
    terminalOutput.appendChild(logLine);
    
    // Add cursor back
    const newCursorLine = document.createElement('div');
    newCursorLine.className = 'terminal-line';
    newCursorLine.innerHTML = '<span class="prompt">user@portfolio:~$ </span><span class="cursor">_</span>';
    terminalOutput.appendChild(newCursorLine);
    
    // Auto-scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    
    // Limit to last 20 lines to prevent overflow
    const lines = terminalOutput.querySelectorAll('.terminal-line');
    if (lines.length > 20) {
        lines[0].remove();
    }
}

// Update the time in the menu bar
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit'
    });
    document.getElementById('current-time').textContent = timeString;
}

// Update time immediately and then every minute
updateTime();
setInterval(updateTime, 60000);

// Add click handlers for folders
document.addEventListener('DOMContentLoaded', function() {
    const folders = document.querySelectorAll('.folder');
    
    folders.forEach(folder => {
        folder.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            const external = this.getAttribute('data-external');
            const folderName = this.querySelector('.folder-label').textContent;
            
            // Log the interaction
            if (page) {
                logToTerminal(`User opened folder: ${folderName} → ${page}`);
                // Add a slight delay for the click animation
                setTimeout(() => {
                    window.location.href = page;
                }, 100);
            } else if (external) {
                if (folderName === "About Me") {
                    logToTerminal(`User opened external link: ${folderName} → Notion About Me`);
                } else if (folderName === "Portfolio") {
                    logToTerminal(`User opened external link: ${folderName} → Notion Portfolio`);
                } else {
                    logToTerminal(`User opened external link: ${folderName} → ${external}`);
                }
                // Open external link in new tab
                setTimeout(() => {
                    window.open(external, '_blank');
                }, 100);
            }
        });
        
        // Log hover interactions
        folder.addEventListener('mouseenter', function() {
            const folderName = this.querySelector('.folder-label').textContent;
            logToTerminal(`User hovering over: ${folderName}`, 'system');
        });
        
        // Add double-click for more authentic feel
        folder.addEventListener('dblclick', function() {
            const page = this.getAttribute('data-page');
            const external = this.getAttribute('data-external');
            const folderName = this.querySelector('.folder-label').textContent;
            
            logToTerminal(`User double-clicked: ${folderName}`, 'success');
            
            if (page) {
                window.location.href = page;
            } else if (external) {
                window.open(external, '_blank');
            }
        });
    });
    
    // Add some desktop interactions
    const desktop = document.querySelector('.desktop-area');
    
    // Log desktop clicks
    desktop.addEventListener('click', function(e) {
        if (e.target === desktop) {
            logToTerminal('User clicked on desktop background', 'system');
        }
    });
    
    // Prevent context menu on desktop area for more authentic feel
    desktop.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        logToTerminal('User attempted right-click (context menu disabled)', 'system');
    });
    
    // Add selection effect on mouse down
    folders.forEach(folder => {
        folder.addEventListener('mousedown', function() {
            this.style.background = 'rgba(255, 255, 255, 0.3)';
        });
        
        folder.addEventListener('mouseup', function() {
            setTimeout(() => {
                this.style.background = '';
            }, 150);
        });
        
        folder.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
    });
    
    // Trash can interaction
    const trashCan = document.querySelector('.trash-can');
    const imagePopup = document.getElementById('imagePopup');
    const closePopup = document.getElementById('closePopup');
    
    if (trashCan) {
        trashCan.addEventListener('click', function() {
            const imageUrl = this.getAttribute('data-image');
            logToTerminal('User clicked on Trash can', 'interaction');
            setTimeout(() => {
                logToTerminal('Opening trash contents window...', 'system');
                imagePopup.style.display = 'block';
            }, 100);
        });
        
        trashCan.addEventListener('mouseenter', function() {
            logToTerminal('User hovering over Trash can', 'system');
        });
    }
    
    // Close popup functionality
    if (closePopup) {
        closePopup.addEventListener('click', function() {
            logToTerminal('User closed trash contents window', 'interaction');
            imagePopup.style.display = 'none';
        });
        
        closePopup.addEventListener('mouseenter', function() {
            logToTerminal('User hovering over close button', 'system');
        });
    }
    
    // Close popup when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === imagePopup) {
            logToTerminal('User clicked outside popup to close', 'interaction');
            imagePopup.style.display = 'none';
        }
    });
    
    // Billie character interaction
    const bartCharacter = document.querySelector('.bart-character');
    const contactWindow = document.querySelector('.contact-window');
    
    if (bartCharacter && contactWindow) {
        bartCharacter.addEventListener('click', function() {
            logToTerminal('User clicked on Billie character', 'interaction');
            setTimeout(() => {
                logToTerminal('Opening contact information...', 'system');
                contactWindow.style.display = 'block';
            }, 100);
        });
        
        bartCharacter.addEventListener('mouseenter', function() {
            logToTerminal('User hovering over Billie', 'system');
        });
    }
    
    // Contact window interactions
    const windowButtons = document.querySelectorAll('.window-button');
    
    if (contactWindow) {
        // Window button interactions
        windowButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.classList.contains('close')) {
                    logToTerminal('User clicked close button on Contact window', 'interaction');
                    contactWindow.style.display = 'none';
                } else if (this.classList.contains('minimize')) {
                    logToTerminal('User clicked minimize button on Contact window', 'interaction');
                    // Add minimize animation here if desired
                } else if (this.classList.contains('maximize')) {
                    logToTerminal('User clicked maximize button on Contact window', 'interaction');
                    // Add maximize animation here if desired
                }
            });
            
            button.addEventListener('mouseenter', function() {
                logToTerminal('User hovering over window button', 'system');
            });
        });
        
        // Log contact window interactions
        contactWindow.addEventListener('click', function() {
            logToTerminal('User clicked on Contact window', 'interaction');
        });
    }
    
    // Log page load
    logToTerminal('Desktop environment loaded successfully', 'success');
    logToTerminal('Ready for user interaction...', 'system');
}); 