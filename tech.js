const supabaseUrl = "https://ksgyzcvatavxwfcrpyes.supabase.co";
const supabaseKey = "sb_publishable__ChoT0aCa3-EkJNB4C0p1g_177RJRZ2";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

async function loadPosts() {

    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("board", "tech")
        .order("created_at", { ascending: false });

    const postsDiv = document.getElementById("posts");
    postsDiv.innerHTML = "";

    if (error) {
        postsDiv.innerHTML = "Error loading posts.";
        return;
    }

    if (data.length === 0) {
        postsDiv.innerHTML = "No posts yet.";
        return;
    }

    data.forEach(post => {

        let html = `
            <div class="box">
                <h3>${post.title || "Untitled"}</h3>
                <p>${post.content}</p>
        `;

        if (post.image_url) {
            html += `
                <img src="${post.image_url}" style="max-width:300px;">
            `;
        }

        html += `</div>`;

        postsDiv.innerHTML += html;
    });
}

document.getElementById("postButton").onclick = async function () {

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("image").value;

    const { error } = await supabase
        .from("posts")
        .insert([
            {
                board: "qa",
                title: title,
                content: content,
                image_url: image
            }
        ]);

    if (error) {
        alert("Error posting.");
        console.log(error);
        return;
    }

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    document.getElementById("image").value = "";

    loadPosts();
};

loadPosts();
