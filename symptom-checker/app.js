const API_URL = window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:5001'
  : 'https://ai-doctor-appointment-system.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("check-btn").addEventListener("click", checkSymptoms);
    document.getElementById("book-btn").addEventListener("click", bookAppointment);
});

async function checkSymptoms() {
    const symptoms = document.getElementById("symptoms-input").value.trim();

    if (!symptoms) {
        alert("Please enter your symptoms.");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("result-section").style.display = "none";

    try {
        const response = await fetch(`${API_URL}/api/symptom-checker`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms })
        });

        const data = await response.json();

        document.getElementById("diagnosis").textContent = data.diagnosis;
        document.getElementById("recommendation").textContent = "Recommended Specialty: " + data.specialty;
        document.getElementById("result-section").style.display = "block";
    } catch (error) {
        alert("Failed to check symptoms. Please try again.");
        console.error(error);
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

function bookAppointment() {
    window.location.href = "/doctor-profile";
}