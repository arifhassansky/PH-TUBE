function getTimeString(time) {
  const day = parseInt(time / 86400);
  let remainingSec = time % 86400;
  const hour = parseInt(remainingSec / 3600);
  remainingSec = remainingSec % 3600;
  const minute = parseInt(remainingSec / 60);
  remainingSec = remainingSec % 60;
  return `${day} Day ${hour} Hour  ${minute} Minute ${remainingSec} second ago`;
}

const activeClassRemove = () => {
  const activeButton = document.getElementsByClassName("category-btn");
  for (let btn of activeButton) {
    btn.classList.remove("active");
  }
};

const loadCategoryVideo = (id) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      activeClassRemove();
      const activeButton = document.getElementById(`btn-${id}`);
      activeButton.classList.add("active");
      showVideos(data.category);
    })
    .catch((error) => console.log(error));
};

const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => showData(data.categories))
    .catch((error) => console.log(error));
};

const loadVideos = (search = "") => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${search}`
  )
    .then((res) => res.json())
    .then((data) => showVideos(data.videos))
    .catch((error) => console.log(error));
};

const loadDetails = async (videoId) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
  );
  const data = await res.json();
  showDetails(data.video);
};

const showDetails = (video) => {
  console.log(video);
  const showModal = document.getElementById("modal-content");
  document.getElementById("customModal").showModal();
  showModal.innerHTML = `
  <img src="${video.thumbnail}" />
  <p class="mt-2">${video.description}</p>
  `;
};

const showData = (categories) => {
  const navButtonContainer = document.getElementById("button-container");
  categories.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <button id="btn-${item.category_id}" onclick = "loadCategoryVideo(${item.category_id})" class="btn category-btn">
    ${item.category}
    </button>
    `;
    navButtonContainer.appendChild(div);
  });
};

// {
//     "category_id": "1001",
//     "video_id": "aaaa",
//     "thumbnail": "https://i.ibb.co/L1b6xSq/shape.jpg",
//     "title": "Shape of You",
//     "authors": [
//         {
//             "profile_picture": "https://i.ibb.co/D9wWRM6/olivia.jpg",
//             "profile_name": "Olivia Mitchell",
//             "verified": ""
//         }
//     ],
//     "others": {
//         "views": "100K",
//         "posted_date": "16278"
//     },
//     "description": "Dive into the rhythm of 'Shape of You,' a captivating track that blends pop sensibilities with vibrant beats. Created by Olivia Mitchell, this song has already gained 100K views since its release. With its infectious melody and heartfelt lyrics, 'Shape of You' is perfect for fans looking for an uplifting musical experience. Let the music take over as Olivia's vocal prowess and unique style create a memorable listening journey."
// }

const showVideos = (videos) => {
  const VideoContainer = document.getElementById("video-container");
  VideoContainer.innerHTML = "";
  if (videos.length == 0) {
    VideoContainer.classList.remove("grid");
    VideoContainer.innerHTML = `
    <div class="h-[400px] flex flex-col justify-center items-center">
      <img src= "assets/Icon.png" />
      <p class = "font-bold text-xl mt-3"> No Content Here for This Category</p>
    </div>
    `;
  } else {
    VideoContainer.classList.add("grid");
  }
  videos.forEach((video) => {
    const card = document.createElement("div");

    card.innerHTML = `
    <div class="card card-compact relative ">
        <figure class = "h-[250px] object-cover">
            <img
            class='h-full'
             src=${video.thumbnail}
            alt="image"
            />
            ${
              video.others.posted_date?.length == 0
                ? ""
                : `<span class="absolute right-2 bottom-28 bg-black p-2 rounded-md text-white text-xs">
                  ${getTimeString(video.others.posted_date)}
                </span>`
            }
            
        </figure>
        
        <div class="py-4 flex gap-3">
             <div>
                 <img
                 class="w-[30px] h-[30px] rounded-full object-cover"
                 src="${video.authors[0].profile_picture}"
                 />
            </div>

            <div>
                <h2 class="font-bold">${video.title}</h2>
                <div class="flex items-center gap-2">
                    <p class="text-gray-600">${
                      video.authors[0].profile_name
                    }</p>
                    ${
                      video.authors[0].verified === true
                        ? `<img class="w-[20px]" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" />`
                        : ""
                    }
                </div>
                <p class="flex " >${video.others.views} 
                <button onclick = "loadDetails('${
                  video.video_id
                }')" class="btn btn-xs ml-52"> Details</button>
                </p>  
            </div> 
        </div>
    </div>
    `;

    VideoContainer.append(card);
  });
};

document.getElementById("search").addEventListener("keyup", (e) => {
  loadVideos(e.target.value);
});

loadCategories();
loadVideos();
