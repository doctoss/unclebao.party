const supabaseUrl = "https://ksgyzcvatavxwfcrpyes.supabase.co";
const supabaseKey = "sb_publishable__ChoT0aCa3-EkJNB4C0p1g_177RJRZ2";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

const board = document.body.dataset.board;

function formatDate(dateString) {
    const d = new Date(dateString);

    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);

    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");

    return `${month}/${day}/${year} ${hours}:${mins}`;
}

async function loadPosts() {

    const { data, error } = await db
        .from("posts")
        .select("*")
        .eq("board", board)
        .order("created_at", { ascending: false });

    const postsDiv = document.getElementById("posts");
    postsDiv.innerHTML = "";

    if (error) {
        postsDiv.innerHTML = "Error loading posts.";
        console.log(error);
        return;
    }

    if (data.length === 0) {
        postsDiv.innerHTML = "No posts yet.";
        return;
    }

    data.forEach(post => {

        let imageHtml = "";

        if (post.image_url) {
            imageHtml = `
                <img src="${post.image_url}">
            `;
        }

        postsDiv.innerHTML += `
            <div class="post">

                <div class="postheader">

                    <span class="subject">
                        ${post.subject || ""}
                    </span>

                    <span class="poster">
                        Bao
                    </span>

                    <span class="postid">
                        No.${post.id}
                    </span>

                    <span class="posttime">
                        ${formatDate(post.created_at)}
                    </span>

                </div>

                <div>
                    ${post.content}
                </div>

                ${imageHtml}

            </div>
        `;
    });
}

document.getElementById("postButton").onclick = async function () {

    const subject =
        document.getElementById("subject").value;

    const content =
        document.getElementById("content").value;

    const file =
        document.getElementById("file").files[0];

    let imageUrl = "";

    if (file) {

        const fileName =
            Date.now() + "_" + file.name;

        const { error: uploadError } =
            await db.storage
                .from("images")
                .upload(fileName, file);

        if (uploadError) {
            alert("Upload failed.");
            console.log(uploadError);
            return;
        }

        const { data } =
            db.storage
                .from("images")
                .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
    }

    const { error } = await db
        .from("posts")
        .insert([
            {
                board: board,
                subject: subject,
                content: content,
                image_url: imageUrl
            }
        ]);

    if (error) {
        alert("Error posting.");
        console.log(error);
        return;
    }

    document.getElementById("subject").value = "";
    document.getElementById("content").value = "";
    document.getElementById("file").value = "";

    loadPosts();
};

loadPosts();