const API_URL = "https://ai-doctor-appointment-system.onrender.com";


document.addEventListener("DOMContentLoaded", () => {
    loadDoctorProfile();
    loadAvailableSlots();

    document.getElementById("book-btn").addEventListener("click", bookAppointment);
});

// Load doctor profile from backend
async function loadDoctorProfile() {
    try {
        const response = await fetch(`${API_URL}/api/doctors/2`);
        const doctor = await response.json();

        document.getElementById("doctor-name").textContent = doctor.name;
        document.getElementById("doctor-specialty").textContent = doctor.specialty;
        document.getElementById("doctor-email").textContent = doctor.email;
        document.getElementById("doctor-phone").textContent = doctor.phone;
        document.getElementById("doctor-photo").src = doctor.photo || "default.png";
    } catch (error) {
        console.error("Failed to load doctor profile:", error);
    }
}

// Load available time slots
async function loadAvailableSlots() {
    try {
        const response = await fetch(`${API_URL}/api/doctors/2/slots`);
        const slots = await response.json();

        const slotsList = document.getElementById("time-slots");
        slotsList.innerHTML = "";

        slots.forEach(slot => {
            const li = document.createElement("li");
            li.textContent = slot.time;
            li.addEventListener("click", () => selectSlot(li, slot.time));
            slotsList.appendChild(li);
        });
    } catch (error) {
        console.error("Failed to load slots:", error);
    }
}

// Select a time slot
let selectedSlot = null;
function selectSlot(element, time) {
    document.querySelectorAll("#time-slots li").forEach(li => li.classList.remove("selected"));
    element.classList.add("selected");
    selectedSlot = time;
}

// Book appointment
async function bookAppointment() {
    if (!selectedSlot) {
        alert("Please select a time slot first.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/appointments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ doctor_id: "1", time: selectedSlot })
        });

        if (response.ok) {
            alert(`Appointment booked for ${selectedSlot}`);
        } else {
            alert("Booking failed. Please try again.");
        }
    } catch (error) {
        console.error("Booking error:", error);
    }
}