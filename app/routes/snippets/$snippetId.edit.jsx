import { Form, useLoaderData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { useState } from "react";
import connectDb from "~/db/connectDb.server";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params.snippetId);
  if (!snippet) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return json(snippet);
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const db = await connectDb();
  try {
    let isFavorite = formData.get("favorite") === "on" ? true : false;
    formData.set('favorite', `${isFavorite}`);
    await db.models.Snippet.findByIdAndUpdate(params.snippetId, Object.fromEntries(formData));
    return redirect(`/snippets/${params.snippetId}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(formData) },
      { status: 400 }
    );
  }
}

export default function CreateSnippet() {
  const snippet = useLoaderData();
  console.log(snippet.favorite);
  const [isChecked, setIsChecked] = useState(snippet.favorite);
  return (
    <Form method="post" className="w-full">
      <h1 className="m-6 font-bold text-center">Edit snippet</h1>
      <div className="md:flex">
        <div className="md:w-1/3 lg:w-1/4 grow md:mr-6">
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Title
            </label>
            <input
              defaultValue={snippet.title}
              name="title"
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Description
            </label>
            <textarea
              name="description"
              defaultValue={snippet.description}
              rows="3"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              htmlFor="language"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Programming language
            </label>
            <select
            defaultValue={snippet.language}
              name="language"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Java">Java</option>
              <option value="C#">C#</option>
              <option value="C">C</option>
              <option value="C++">C++</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
              <option value="PHP">PHP</option>
              <option value="R">R</option>
            </select>
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
              key={snippet.id}
                name="favorite"
                type="checkbox"
                checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              />
              <span className="text-indigo-600">
                <svg
                  onClick={() => setIsChecked(!isChecked)}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill={isChecked ? "currentColor" : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </span>
            </div>
            <label
              htmlFor="remember"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Favorite
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/2 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 max-w-md mb-6"
          >
            Save
          </button>
        </div>
        <div className="md:w-2/3 lg:w-3/4 grow">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Snippet
          </label>
          <textarea
          defaultValue={snippet.code}
            name="code"
            rows="18"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          ></textarea>
        </div>
      </div>
    </Form>
  );
}
