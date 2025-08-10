document.addEventListener('DOMContentLoaded', () => {
    const skillContainer = document.getElementById('skill-container');
    const searchInput = document.getElementById('searchInput');
    
    let allSkills = []; 
    const INITIAL_DISPLAY_COUNT = 200;

    fetch('skills_corrected.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('網路錯誤，無法載入 skills_corrected.json');
            }
            return response.json();
        })
        .then(data => {
            allSkills = data;
            displaySkills(allSkills.slice(0, INITIAL_DISPLAY_COUNT)); 
        })
        .catch(error => {
            console.error('讀取 JSON 檔案時發生錯誤:', error);
            skillContainer.innerHTML = `<p class="loading-text" style="color: #e74c3c;">資料載入失敗！請檢查檔案路徑與格式。</p>`;
        });

    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase(); 

        if (!searchTerm) {
            displaySkills(allSkills.slice(0, INITIAL_DISPLAY_COUNT));
            return;
        }

        // ▼▼▼ 修改處：將 .description 改為 .desc ▼▼▼
        const filteredSkills = allSkills.filter(skill => {
            const name = skill.name || '';
            const description = skill.desc || ''; // <--- 修正點
            
            const nameMatch = name.toLowerCase().includes(searchTerm);
            const descMatch = description.toLowerCase().includes(searchTerm);
            return nameMatch || descMatch;
        });

        displaySkills(filteredSkills);
    });

    function displaySkills(skillsToDisplay) {
        skillContainer.innerHTML = '';

        if (skillsToDisplay.length === 0) {
            skillContainer.innerHTML = `<p class="loading-text">找不到符合條件的技能。</p>`;
            return;
        }

        skillsToDisplay.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            
            // ▼▼▼ 修改處：將 .description 改為 .desc，並確保 id 能正確讀取 ▼▼▼
            const skillName = skill.name || '無名稱';
            const skillId = skill.id !== undefined ? skill.id : 'N/A'; // <--- 修正點 (強化讀取)
            const skillDescription = skill.desc || '無敘述'; // <--- 修正點

            card.innerHTML = `
                <div class="skill-header">
                    <span class="skill-name">${skillName}</span>
                    <span class="skill-id">ID: ${skillId}</span>
                </div>
                <p class="skill-description">${skillDescription}</p>
            `;
            skillContainer.appendChild(card);
        });
    }
});
