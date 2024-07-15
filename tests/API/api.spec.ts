import { test, expect } from "@playwright/test";

let newPostId: number;
let TOTALNUMBEROFPOSTS: number;
// 1. Read Total Number of Posts and Store in a Variable:
test.describe("Get Request", () => {
  const baseUrl = "https://jsonplaceholder.typicode.com";
  test("Get Posts", async ({ request }) => {
    const response = await request.get(`${baseUrl}/posts`);
    expect(response.status()).toBe(200);
    const responseBody = JSON.parse(await response.text());
    TOTALNUMBEROFPOSTS = responseBody.length;
    console.log(`Total Number of posts returned ${TOTALNUMBEROFPOSTS}`);
  });

  //   Create a New Post and Store its ID:
  //   let newPostId: string;
  test("Create Posts", async ({ request }) => {
    const response = await request.post(`${baseUrl}/posts`, {
      data: {
        title: "quaerat velit veniam amet cupiditate aut numquam ut sequi",
        body:
          "in non odio excepturi sint eum\n" +
          "labore voluptates vitae quia qui et\n" +
          "inventore itaque rerum\n" +
          "veniam non exercitationem delectus aut",
      },
    });
    expect(response.status()).toBe(201);
    const responseBody = JSON.parse(await response.text());
    newPostId = responseBody.id;
    console.log("New Post ID:", newPostId);
  });

  let id: number;
  test("Get Post with ID", async ({ request }) => {
    id = newPostId - 1;
    const response = await request.get(`${baseUrl}/posts/${id}`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(id);
    expect(responseBody.title).toBe("at nam consequatur ea labore ea harum");

    expect(responseBody.body).toBe(
      `cupiditate quo est a modi nesciunt soluta
ipsa voluptas error itaque dicta in
autem qui minus magnam et distinctio eum
accusamus ratione error aut`
    );
    console.log("Created Post:", responseBody);
  });

  // 3. Replace Some Field in the Created Post with PATCH:
  test("Update Post with PATCH", async ({ request }) => {
    const patchResponse = await request.patch(`${baseUrl}/posts/${id}`, {
      data: {
        title: "This title has been updated",
      },
    });
    expect(patchResponse.status()).toBe(200);

    // 4. Confirm the successful update with a GET request
    // Since JSONPlaceholder does not persist changes, the GET request will still return the original post
    const getResponse = await request.get(`${baseUrl}/posts/${id}`);
    expect(getResponse.status()).toBe(200);
    const updatedResponseBody = await getResponse.json();

    expect(updatedResponseBody.id).toBe(id);
    expect(updatedResponseBody.title).toBe(
      "at nam consequatur ea labore ea harum"
    );
    expect(updatedResponseBody.body)
      .toBe(`cupiditate quo est a modi nesciunt soluta
ipsa voluptas error itaque dicta in
autem qui minus magnam et distinctio eum
accusamus ratione error aut`);
    console.log("Updated Post:", updatedResponseBody);
  });
  //   Step 5: Delete the Created Post by ID
  test("Delete Post by ID", async ({ request }) => {
    const deleteResponse = await request.delete(`${baseUrl}/posts/${id}`);
    expect(deleteResponse.status()).toBe(200);

    // Verify the post has been deleted
    const getResponse = await request.get(`${baseUrl}/posts/${newPostId}`);
    expect(getResponse.status()).toBe(404);
    console.log("Post Deleted:", newPostId);
  });

  // Step 6: Check the Number of Posts to Ensure Integrity
  test("Verify Total Number of Posts After Deletion", async ({ request }) => {
    const response = await request.get(`${baseUrl}/posts`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const currentTotalPosts = responseBody.length;
    console.log("Current Total Number of Posts:", currentTotalPosts);
    expect(currentTotalPosts).toBe(TOTALNUMBEROFPOSTS);
  });
});
