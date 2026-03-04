import {
  db,
  doc,
  serverTimestamp,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
} from "./firebase.js";

const addBtn = document.getElementById("addBtn");
const quoteList = document.getElementById("quoteList");
const quoteInput = document.getElementById("quoteInput");
const quoteCollection = collection(db, "quotes");

addBtn.addEventListener("click", addQuote);

function handleFirestoreError(error, action) {
  if (error?.code === "permission-denied") {
    console.error(
      `Firestore permission denied while trying to ${action}. Update Firestore Security Rules.`,
      error
    );
    return;
  }

  console.error(`Error while trying to ${action}:`, error);
}

async function addQuote() {
  try {
    const quote = quoteInput.value.trim();
    if (!quote) return;

    await addDoc(quoteCollection, {
      quote,
      time: serverTimestamp(),
    });

    quoteInput.value = "";
    await renderQuotes();
  } catch (error) {
    handleFirestoreError(error, "add a quote");
  }
}

async function renderQuotes() {
  try {
    quoteList.innerHTML = "";
    const querySnapshot = await getDocs(quoteCollection);

    if (querySnapshot.empty) {
      const emptyItem = document.createElement("li");
      emptyItem.className =
        "rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-slate-500";
      emptyItem.textContent = "No quotes yet. Add your first quote.";
      quoteList.appendChild(emptyItem);
      return;
    }

    querySnapshot.forEach((quoteDoc) => {
      const li = document.createElement("li");
      li.className =
        "flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between";

      const quoteText = document.createElement("p");
      quoteText.className = "break-words text-slate-800";
      quoteText.textContent = quoteDoc.data().quote;

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.className =
        "rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300";
      editButton.addEventListener("click", () => {
        editQuote(quoteDoc.id, quoteDoc.data().quote);
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className =
        "rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300";
      deleteButton.addEventListener("click", () => {
        deleteQuote(quoteDoc.id);
      });

      const buttonGroup = document.createElement("div");
      buttonGroup.className = "flex items-center gap-2";

      buttonGroup.appendChild(editButton);
      buttonGroup.appendChild(deleteButton);

      li.appendChild(quoteText);
      li.appendChild(buttonGroup);
      quoteList.appendChild(li);
    });
  } catch (error) {
    handleFirestoreError(error, "load quotes");
  }
}

async function editQuote(id, oldQuote) {
  try {
    const newQuote = prompt("Enter new quote", oldQuote)?.trim();
    if (!newQuote || newQuote === oldQuote) return;

    await updateDoc(doc(db, "quotes", id), {
      quote: newQuote,
      time: serverTimestamp(),
    });

    await renderQuotes();
  } catch (error) {
    handleFirestoreError(error, "edit a quote");
  }
}

async function deleteQuote(id) {
  try {
    await deleteDoc(doc(db, "quotes", id));
    await renderQuotes();
  } catch (error) {
    handleFirestoreError(error, "delete a quote");
  }
}

renderQuotes();
