// assets/js/script.js

// Example: Handle form submission for sending notifications
document.addEventListener('DOMContentLoaded', () => {
    const notificationForm = document.querySelector('#notifications form');
    
    if (notificationForm) {
      notificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Gather form data
        const subject = document.getElementById('subject').value;
        const content = document.getElementById('content').value;
        const attachment = document.getElementById('attachment').files[0];
        const target = document.getElementById('target').value;
        
        // Here you can add AJAX requests to send data to your server
        // For demonstration, we'll just log the data
        console.log('Notification Subject:', subject);
        console.log('Notification Content:', content);
        console.log('Attachment:', attachment);
        console.log('Target Users:', target);
        
        // Reset form after submission
        notificationForm.reset();
        
        // Provide feedback to the admin
        alert('Notification sent successfully!');
      });
    }
  });
  