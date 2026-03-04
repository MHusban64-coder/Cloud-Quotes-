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

    querySnapshot.forEach((quoteDoc) => {
      const li = document.createElement("li");
      li.textContent = `${quoteDoc.data().quote} `;

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        editQuote(quoteDoc.id, quoteDoc.data().quote);
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteQuote(quoteDoc.id);
      });

      li.appendChild(editButton);
      li.appendChild(deleteButton);
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
