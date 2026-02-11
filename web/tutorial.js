


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- Движок Интерактивного Обучения v5 (строго по плану) ---

let tutorialDriver = {
    steps: [],
    currentStepIndex: 0,
    isActive: false,
    elements: { overlay: null, popover: null, text: null, counter: null, nextBtn: null },
    eventListener: null,
};

function blockEscape(e) {
    if (e.key === 'Escape' && tutorialDriver.isActive) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }
}

function initializeTutorialElements() {
    if (tutorialDriver.elements.overlay) return;

    tutorialDriver.elements.overlay = document.getElementById('tutorial-overlay');
    tutorialDriver.elements.popover = document.getElementById('tutorial-popover');
    tutorialDriver.elements.text = document.getElementById('tutorial-text');
    tutorialDriver.elements.counter = document.getElementById('tutorial-step-counter');
    tutorialDriver.elements.nextBtn = document.getElementById('tutorial-next-btn');

    tutorialDriver.elements.nextBtn.addEventListener('click', () => {
        if (tutorialDriver.currentStepIndex === tutorialDriver.steps.length - 1) {
            endTutorial();
        } else {
            advanceTutorial();
        }
    });
}

function startTutorial(steps) {
    if (tutorialDriver.isActive) return;

    initializeTutorialElements();
    
    tutorialDriver.steps = steps;
    tutorialDriver.currentStepIndex = 0;
    tutorialDriver.isActive = true;

    document.addEventListener('keydown', blockEscape, true);

    document.body.classList.add('tutorial-active');
    tutorialDriver.elements.overlay.classList.remove('hidden');
    tutorialDriver.elements.popover.classList.remove('hidden');
    
    showTutorialStep(tutorialDriver.currentStepIndex);
}

function endTutorial() {
    if (!tutorialDriver.isActive) return;
    
    document.removeEventListener('keydown', blockEscape, true);

    const lastStep = tutorialDriver.steps[tutorialDriver.currentStepIndex];
    if (lastStep && lastStep.element) {
        const lastTargetElement = document.querySelector(lastStep.element);
        if (lastTargetElement) {
            lastTargetElement.style.pointerEvents = '';
            lastTargetElement.style.zIndex = '';
        }
    }

    if (tutorialDriver.eventListener) {
        tutorialDriver.eventListener.element.removeEventListener(tutorialDriver.eventListener.event, tutorialDriver.eventListener.handler);
        tutorialDriver.eventListener = null;
    }

    tutorialDriver.isActive = false;
    document.body.classList.remove('tutorial-active');
    
    tutorialDriver.elements.overlay.classList.remove('visible');
    tutorialDriver.elements.popover.classList.remove('visible');
    tutorialDriver.elements.overlay.style.boxShadow = '';

    setTimeout(() => {
        tutorialDriver.elements.overlay.classList.add('hidden');
        tutorialDriver.elements.popover.classList.add('hidden');
    }, 300);

    setTimeout(() => location.reload(), 400); 

}

function advanceTutorial() {
    const prevStep = tutorialDriver.steps[tutorialDriver.currentStepIndex];
    if (prevStep && prevStep.element) {
        const prevTargetElement = document.querySelector(prevStep.element);
        if (prevTargetElement) {
            prevTargetElement.style.pointerEvents = '';
            prevTargetElement.style.zIndex = '';
        }
    }

    tutorialDriver.currentStepIndex++;
    if (tutorialDriver.currentStepIndex >= tutorialDriver.steps.length) {
        endTutorial();
    } else {
        showTutorialStep(tutorialDriver.currentStepIndex);
    }
}

function showTutorialStep(index) {
    if (tutorialDriver.eventListener) {
        tutorialDriver.eventListener.element.removeEventListener(tutorialDriver.eventListener.event, tutorialDriver.eventListener.handler);
        tutorialDriver.eventListener = null;
    }

    const step = tutorialDriver.steps[index];
    const targetElement = step.element ? document.querySelector(step.element) : document.body;

    if (!targetElement) {
        console.warn(`Tutorial element not found: ${step.element}`);
        advanceTutorial();
        return;
    }

    if (step.element) {
        targetElement.style.pointerEvents = 'auto';
        targetElement.style.position = 'relative';
        targetElement.style.zIndex = '9999';
    }
    tutorialDriver.elements.popover.style.pointerEvents = 'auto';

    tutorialDriver.elements.text.innerHTML = step.text;
    tutorialDriver.elements.counter.textContent = `Step ${index + 1} of ${tutorialDriver.steps.length}`;
    if (index === tutorialDriver.steps.length - 1) {
        tutorialDriver.elements.nextBtn.textContent = 'Finish';
    } else {
        tutorialDriver.elements.nextBtn.textContent = 'Next';
    }

    if (step.waitFor) {
        tutorialDriver.elements.nextBtn.style.display = 'none';

        const eventElement = document.querySelector(step.waitFor.element);
        if (eventElement) {
            const handler = () => {
                setTimeout(advanceTutorial, 500); 
            };

            eventElement.addEventListener(step.waitFor.event, handler, { once: true });
            tutorialDriver.eventListener = { element: eventElement, event: step.waitFor.event, handler };
        }
    } else {
        tutorialDriver.elements.nextBtn.style.display = 'block';
    }

    if (step.element) {
        const rect = targetElement.getBoundingClientRect();
        const padding = step.padding || 10;
        const highlightX = rect.left - padding;
        const highlightY = rect.top - padding;
        const highlightWidth = rect.width + 2 * padding;
        const highlightHeight = rect.height + 2 * padding;
        
        const shadowX = highlightX + highlightWidth / 2 - window.innerWidth / 2;
        const shadowY = highlightY + highlightHeight / 2 - window.innerHeight / 2;
        
        tutorialDriver.elements.overlay.style.boxShadow = `${-shadowX}px ${-shadowY}px 0 5000px rgba(0, 0, 0, 0.7)`;
        positionPopover(highlightX, highlightY, highlightWidth, highlightHeight);
    } else {
        // Если элемент не указан, показываем поповер по центру
        tutorialDriver.elements.overlay.style.boxShadow = '0 0 0 5000px rgba(0, 0, 0, 0.7)';
        const popover = tutorialDriver.elements.popover;
        popover.style.left = `50%`;
        popover.style.top = `50%`;
        popover.style.transform = 'translate(-50%, -50%)';
    }
    
    tutorialDriver.elements.overlay.classList.add('visible');
    tutorialDriver.elements.popover.classList.add('visible');
}

function positionPopover(x, y, width, height) {
    const popover = tutorialDriver.elements.popover;
    popover.style.transform = ''; // Сбрасываем центрирование
    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;
    const margin = 15;

    let top = y + height + margin;
    let left = x + (width / 2) - (popoverWidth / 2);

    if (top + popoverHeight > window.innerHeight) {
        top = y - popoverHeight - margin;
    }

    if (left < 0) left = margin;
    if (left + popoverWidth > window.innerWidth) left = window.innerWidth - popoverWidth - margin;

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
}
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


