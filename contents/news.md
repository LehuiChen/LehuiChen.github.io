<section id="news-md" class="container my-5">
  <h2 class="text-center mb-4">News</h2>

  <div style="display:flex; flex-wrap:wrap; gap:20px; justify-content:center;">

```HTML
<!-- 新闻卡片 1 -->
<div style="flex:1 1 45%; max-width:45%; box-sizing:border-box; text-align:center; padding:20px; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.15); background:#fff; transition: transform 0.3s ease-in-out;">
  <img src="static/assets/img/news/event1.jpg" alt="2024-05-20，南亭村_好口福"
       style="width:100%; height:300px; object-fit:cover; display:block; border-radius:12px;">
  <div style="padding:12px; font-size:1rem; font-weight:500; color:#444; background:#fafafa; margin-top:10px;">
    🎉“真粘新材”成员聚会
  </div>
</div>

<!-- 新闻卡片 2 -->
<div style="flex:1 1 45%; max-width:45%; box-sizing:border-box; text-align:center; padding:20px; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.15); background:#fff; transition: transform 0.3s ease-in-out;">
  <img src="static/assets/img/news/event2.jpg" alt="2024-08-21，岭南师范学院"
       style="width:100%; height:300px; object-fit:cover; display:block; border-radius:12px;">
  <div style="padding:12px; font-size:1rem; font-weight:500; color:#444; background:#fafafa; margin-top:10px;">
    🎉团队代表广东工业大学拿到“国创赛(2024)”广东省分赛亚军
  </div>
</div>

<!-- 新闻卡片 3 -->
<div style="flex:1 1 45%; max-width:45%; box-sizing:border-box; text-align:center; padding:20px; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.15); background:#fff; transition: transform 0.3s ease-in-out;">
  <img src="static/assets/img/news/event3.jpg" alt="2024-10-13，上海交通大学"
       style="width:100%; height:300px; object-fit:cover; display:block; border-radius:12px;">
  <div style="padding:12px; font-size:1rem; font-weight:500; color:#444; background:#fafafa; margin-top:10px;">
    🎉团队拿到“国创赛(2024)”金奖
  </div>
</div>

<!-- 新闻卡片 4 -->
<div style="flex:1 1 45%; max-width:45%; box-sizing:border-box; text-align:center; padding:20px; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.15); background:#fff; transition: transform 0.3s ease-in-out;">
  <img src="static/assets/img/news/event4.jpg" alt="2025-08-03，中山大学"
       style="width:100%; height:300px; object-fit:cover; display:block; border-radius:12px;">
  <div style="padding:12px; font-size:1rem; font-weight:500; color:#444; background:#fafafa; margin-top:10px;">
    🎉团队拿到“国创赛(2025)”广东省分赛银奖
  </div>
</div>
```

  </div>
</section>

<!-- 悬停缩放效果 -->
<style>
#news-md div[style*="transition: transform"] {
  cursor: pointer;
}
#news-md div[style*="transition: transform"]:hover {
  transform: scale(1.03);
}
</style>
