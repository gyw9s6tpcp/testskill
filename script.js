document.addEventListener('DOMContentLoaded', () => {
    const skillContainer = document.getElementById('skill-container');
    const searchInput = document.getElementById('searchInput');
    
    let allSkills = []; // 用來儲存從 JSON 讀取的全部技能資料
    const INITIAL_DISPLAY_COUNT = 200; // 設定初始顯示的技能數量

    // 1. 載入 JSON 資料
    fetch('skills_corrected.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('網路錯誤，無法載入 skills_corrected.json');
            }
            return response.json();
        })
        .then(data => {
            allSkills = data; // 將完整的資料存起來
            // ▼▼▼ 修改處：只顯示前 200 筆資料 ▼▼▼
            displaySkills(allSkills.slice(0, INITIAL_DISPLAY_COUNT)); 
        })
        .catch(error => {
            console.error('讀取 JSON 檔案時發生錯誤:', error);
            skillContainer.innerHTML = `<p class="loading-text" style="color: #e74c3c;">資料載入失敗！請檢查檔案路徑與格式。</p>`;
        });

    // 2. 監聽搜尋框的輸入事件
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase(); 

        // ▼▼▼ 修改處：如果搜尋框為空，恢復顯示初始的 200 筆資料 ▼▼▼
        if (!searchTerm) {
            displaySkills(allSkills.slice(0, INITIAL_DISPLAY_COUNT));
            return;
        }

        // ▼▼▼ 修改處：搜尋依然是從完整的 "allSkills" 陣列中進行過濾 ▼▼▼
        const filteredSkills = allSkills.filter(skill => {
            // 確保 skill.name 和 skill.description 存在且為字串
            const name = skill.name || '';
            const description = skill.description || '';
            
            const nameMatch = name.toLowerCase().includes(searchTerm);
            const descMatch = description.toLowerCase().includes(searchTerm);
            return nameMatch || descMatch;
        });

        displaySkills(filteredSkills); // 顯示過濾後的技能
    });

    // 3. 用來顯示技能卡片的函式 (此函式維持不變)
    function displaySkills(skillsToDisplay) {
        skillContainer.innerHTML = '';

        if (skillsToDisplay.length === 0) {
            skillContainer.innerHTML = `<p class="loading-text">找不到符合條件的技能。</p>`;
            return;
        }

        skillsToDisplay.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            // 確保顯示的內容若為 null 或 undefined 時，顯示為空字串
            const skillName = skill.name || '無名稱';
            const skillId = skill.id || 'N/A';
            const skillDescription = skill.description || '無敘述';

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
