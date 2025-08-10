document.addEventListener('DOMContentLoaded', () => {
    const skillContainer = document.getElementById('skill-container');
    const searchInput = document.getElementById('searchInput');
    
    let allSkills = []; // 用來儲存從 JSON 讀取的全部技能資料

    // 1. 載入 JSON 資料
    fetch('skills_corrected.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('網路錯誤，無法載入 skills_corrected.json');
            }
            return response.json();
        })
        .then(data => {
            allSkills = data; // 將資料存到 allSkills 變數中
            displaySkills(allSkills); // 初始顯示所有技能
        })
        .catch(error => {
            console.error('讀取 JSON 檔案時發生錯誤:', error);
            skillContainer.innerHTML = `<p class="loading-text" style="color: #e74c3c;">資料載入失敗！請檢查檔案路徑與格式。</p>`;
        });

    // 2. 監聽搜尋框的輸入事件
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase(); // 取得搜尋文字並轉為小寫以便比對

        // 如果搜尋框是空的，就顯示所有技能
        if (!searchTerm) {
            displaySkills(allSkills);
            return;
        }

        // 過濾出符合搜尋條件的技能
        const filteredSkills = allSkills.filter(skill => {
            const nameMatch = skill.name.toLowerCase().includes(searchTerm);
            const descMatch = skill.description.toLowerCase().includes(searchTerm);
            return nameMatch || descMatch; // 技能名稱或敘述符合都顯示
        });

        displaySkills(filteredSkills); // 顯示過濾後的技能
    });

    // 3. 用來顯示技能卡片的函式
    function displaySkills(skillsToDisplay) {
        // 先清空目前的容器
        skillContainer.innerHTML = '';

        if (skillsToDisplay.length === 0) {
            skillContainer.innerHTML = `<p class="loading-text">找不到符合條件的技能。</p>`;
            return;
        }

        // 為每一個技能物件建立一個卡片
        skillsToDisplay.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            card.innerHTML = `
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-id">ID: ${skill.id}</span>
                </div>
                <p class="skill-description">${skill.description}</p>
            `;
            skillContainer.appendChild(card);
        });
    }
});