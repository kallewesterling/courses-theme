document.addEventListener("DOMContentLoaded", () => {
    function createBadges() {
        // create the "badge div"
        const badgingDiv = document.createElement("div");
        badgingDiv.classList.add(...["coursebox-text", "badge-box"])

        const elements = [
            document.querySelector("a[data-course='securing-ai']"),
            document.querySelector("a[data-course='vulnerability-management-certification']"),
            document.querySelector("a[data-course-series='linkys-guide-to-chainguard-images']")
        ].filter(d => d)
        
        // insert badges
        elements.forEach(e => {
            const element = badgingDiv.cloneNode();
            element.textContent = "Earn a Badge"
            e.insertBefore(element, e.firstChild);
        })
    }

    createBadges();
})
