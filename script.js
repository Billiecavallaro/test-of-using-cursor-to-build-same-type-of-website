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
                } else if (folderName === "Press") {
                    logToTerminal(`User opened external link: ${folderName} → Notion Press`);
                } else {
                    logToTerminal(`User opened external link: ${folderName} → ${external}`);
                }
                // Open external link in new tab
                setTimeout(() => {
                    window.open(external, '_blank');
                }, 100);
            } else if (this.getAttribute('data-music')) {
                logToTerminal(`User opened Music Studio window`, 'interaction');
                setTimeout(() => {
                    logToTerminal('Opening music recording interface...', 'system');
                    document.getElementById('musicWindow').style.display = 'block';
                }, 100);
            } else if (this.getAttribute('data-photos')) {
                logToTerminal(`User opened Photo Gallery window`, 'interaction');
                setTimeout(() => {
                    logToTerminal('Opening photo gallery interface...', 'system');
                    document.getElementById('galleryWindow').style.display = 'block';
                    // Set up photo click handlers after gallery is opened
                    setupPhotoHandlers();
                    
                    // Debug: Check if download buttons exist
                    const downloadButtons = document.querySelectorAll('.photo-download-btn');
                    console.log('Found download buttons:', downloadButtons.length);
                    logToTerminal(`Found ${downloadButtons.length} download buttons`, 'system');
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
        if (event.target === musicWindow) {
            logToTerminal('User clicked outside music window to close', 'interaction');
            musicWindow.style.display = 'none';
        }
        if (event.target === galleryWindow) {
            logToTerminal('User clicked outside gallery window to close', 'interaction');
            galleryWindow.style.display = 'none';
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
    
    // Music window interactions
    const musicWindow = document.getElementById('musicWindow');
    const closeMusicWindow = document.getElementById('closeMusicWindow');
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const playButton = document.getElementById('playButton');
    const soundButtons = document.querySelectorAll('.sound-button');
    const masterSlider = document.getElementById('masterSlider');
    const masterVolume = document.getElementById('masterVolume');
    const recordingStatus = document.getElementById('recordingStatus');
    
    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;
    
    if (closeMusicWindow) {
        closeMusicWindow.addEventListener('click', function() {
            logToTerminal('User closed Music Studio window', 'interaction');
            musicWindow.style.display = 'none';
        });
    }
    
    if (recordButton) {
        recordButton.addEventListener('click', function() {
            if (!isRecording) {
                startRecording();
            }
        });
    }
    
    if (stopButton) {
        stopButton.addEventListener('click', function() {
            if (isRecording) {
                stopRecording();
            }
        });
    }
    
    if (playButton) {
        playButton.addEventListener('click', function() {
            playRecording();
        });
    }
    
    // Sound library interactions
    soundButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sound = this.getAttribute('data-sound');
            logToTerminal(`User played ${sound} sound`, 'interaction');
            playSound(sound);
        });
    });
    
    // Volume control
    if (masterSlider) {
        masterSlider.addEventListener('input', function() {
            const volume = this.value;
            masterVolume.textContent = volume + '%';
            logToTerminal(`Master volume set to ${volume}%`, 'system');
        });
    }
    
    // Recording functions
    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                window.recordedAudio = audioUrl;
            };
            
            mediaRecorder.start();
            isRecording = true;
            recordButton.disabled = true;
            stopButton.disabled = false;
            recordingStatus.textContent = '🔴 Recording...';
            logToTerminal('Recording started', 'success');
        } catch (error) {
            logToTerminal('Error starting recording: ' + error.message, 'error');
            recordingStatus.textContent = 'Error: Could not access microphone';
        }
    }
    
    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            isRecording = false;
            recordButton.disabled = false;
            stopButton.disabled = true;
            playButton.disabled = false;
            recordingStatus.textContent = '✅ Recording saved!';
            logToTerminal('Recording stopped', 'success');
        }
    }
    
    function playRecording() {
        if (window.recordedAudio) {
            const audio = new Audio(window.recordedAudio);
            audio.play();
            logToTerminal('Playing recorded audio', 'success');
        }
    }
    
    function playSound(sound) {
        // Simple sound simulation - in a real app you'd load actual audio files
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different frequencies for different sounds
        const frequencies = {
            drum: 100,
            piano: 440,
            guitar: 220,
            bass: 110,
            synth: 880,
            fx: 660
        };
        
        oscillator.frequency.setValueAtTime(frequencies[sound] || 440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
}

// Gallery window interactions - Download Only
const galleryWindow = document.getElementById('galleryWindow');
let currentPhoto = null; // Global variable for current photo

// Modal close handling
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
});

// Function to set up photo click handlers
function setupPhotoHandlers() {
    const photoItems = document.querySelectorAll('.photo-item');
    logToTerminal(`Setting up click handlers for ${photoItems.length} photos`, 'system');
    
    photoItems.forEach(item => {
        // Remove any existing click handlers to prevent duplicates
        item.removeEventListener('click', photoClickHandler);
        // Add new click handler
        item.addEventListener('click', photoClickHandler);
    });
}

// Photo click handler function
function photoClickHandler() {
    const src = this.getAttribute('data-src');
    const name = this.getAttribute('data-name');
    logToTerminal(`Photo clicked: ${name}`, 'system');
    viewPhoto(src, name);
}

function viewPhoto(src, name) {
    logToTerminal(`viewPhoto called with: ${name}`, 'system');
    currentPhoto = { src, name };
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalInfo = document.getElementById('modalInfo');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!modal || !modalImage || !modalInfo || !modalTitle) {
        logToTerminal('Error: Modal elements not found', 'error');
        return;
    }
    
    modalImage.innerHTML = `<img src="${src}" class="modal-image" alt="${name}">`;
    modalInfo.innerHTML = `<h4>${name}</h4>`;
    modalTitle.textContent = `Photo Viewer - ${name}`;
    
    modal.style.display = 'flex';
    console.log('Modal displayed:', modal.style.display);
    logToTerminal(`User viewed photo: ${name}`, 'interaction');
}



function shufflePhotos() {
    const grid = document.getElementById('galleryGrid');
    const photoItems = Array.from(grid.children);
    
    // Fisher-Yates shuffle
    for (let i = photoItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        grid.appendChild(photoItems[j]);
    }
    
    logToTerminal('User shuffled photos in gallery', 'interaction');
}

function showAbout() {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalInfo = document.getElementById('modalInfo');
    const modalTitle = document.getElementById('modalTitle');
    
    modalImage.innerHTML = '';
    modalInfo.innerHTML = `
        <h3>Mac OS X Photo Gallery</h3>
        <p>A nostalgic recreation of early 2000s Mac photo management software.</p>
        <p>Features the classic Aqua interface with brushed metal styling.</p>
        <p><strong>Current Features:</strong></p>
        <ul style="text-align: left; margin: 10px 0;">
            <li>View photos in full-size modal</li>
            <li>Download individual photos</li>
            <li>Download all photos at once</li>
            <li>Shuffle gallery layout</li>
        </ul>
    `;
    modalTitle.textContent = 'About Photo Gallery';
    
    modal.style.display = 'flex';
    logToTerminal('User opened About dialog', 'interaction');
}

});

// Global function to close modal
function closeModal() {
    console.log('closeModal function called');
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
        currentPhoto = null;
        logToTerminal('User clicked red traffic light to close photo viewer', 'interaction');
        console.log('Modal closed successfully');
    } else {
        console.log('Modal element not found');
        logToTerminal('Error: Modal element not found', 'error');
    }
}

// Global function to close gallery window
function closeGalleryWindow() {
    console.log('closeGalleryWindow function called');
    const galleryWindow = document.getElementById('galleryWindow');
    if (galleryWindow) {
        galleryWindow.style.display = 'none';
        logToTerminal('User clicked red traffic light to close photo gallery', 'interaction');
        console.log('Gallery window closed successfully');
    } else {
        console.log('Gallery window element not found');
        logToTerminal('Error: Gallery window element not found', 'error');
    }
}

// Log page load
logToTerminal('Desktop environment loaded successfully', 'success');
logToTerminal('Ready for user interaction...', 'system'); 