const supabaseUrl = "https://ksgyzcvatavxwfcrpyes.supabase.co";
const supabaseKey = "sb_publishable__ChoT0aCa3-EkJNB4C0p1g_177RJRZ2";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

async function checkSession() {

    const {
        data
    } = await db.auth.getSession();

    if (data.session) {

        document.getElementById(
            "status"
        ).innerHTML =
            "<span style='color:red;font-weight:bold'>Citric</span> ## Creator <button id='logoutButton'>Logout</button>";

        loadAdminPosts();
    }
}

async function loadAdminPosts() {

    const { data, error } =
        await db
            .from("posts")
            .select("*")
            .order(
                "created_at",
                { ascending:false }
            );

    const div =
        document.getElementById(
            "adminPosts"
        );

    div.innerHTML = "";

    if (error) {
        div.innerHTML =
            "Error loading posts";
        return;
    }

    data.forEach(post => {

        div.innerHTML += `

        <div class="post">

            <div class="postheader">

                <span style="
                    color:red;
                    font-weight:bold;
                ">
                    Citric
                </span>

                <span style="
                    color:red;
                    font-weight:bold;
                ">
                    ## Creator
                </span>

                — moderating
                No.${post.id}

            </div>

            <div>
                ${post.content}
            </div>

            <br>

            <button
                onclick="deletePost(${post.id})">
                Delete
            </button>

        </div>
        `;
    });

    const logout =
        document.getElementById(
            "logoutButton"
        );

    if (logout) {

        logout.onclick =
            async function () {

                await db.auth.signOut();
                location.reload();
            };
    }
}

async function deletePost(id) {

    const { error } =
        await db
            .from("posts")
            .delete()
            .eq("id", id);

    if (error) {
        alert("Delete failed");
        console.log(error);
        return;
    }

    loadAdminPosts();
}

document.getElementById(
    "loginButton"
).onclick = async function () {

    const email =
        document.getElementById(
            "email"
        ).value;

    const password =
        document.getElementById(
            "password"
        ).value;

    const { error } =
        await db.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        alert("Login failed");
        console.log(error);
        return;
    }

    document.getElementById(
        "status"
    ).innerHTML =
        "<span style='color:red;font-weight:bold'>Citric</span> ## Creator";

    loadAdminPosts();
};

checkSession();