"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookPlus,
  Star,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMyBook } from "@/lib/my-books";
import { cn } from "@/lib/utils";


const CATEGORIES = [
  "Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Thriller",
  "Biography",
  "History",
  "Self-Help",
  "Technology",
  "Business",
  "Children's",
  "Poetry",
  "Philosophy",
];

const emptyDraft = {
  name: "",
  author: "",
  category: "",
  imageUrl: "",
  price: "",
  duration: "",
  description: "",
  rating: "",
};

export default function AddBookPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [draft, setDraft] = useState(emptyDraft);

  const ratingValue = Math.min(
    5,
    Math.max(0, Number(draft.rating) || 0)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name in emptyDraft) {
      setDraft((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!category) {
      toast.error("Category is required", {
        description: "Please pick a category for this book.",
      });
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const bookData = {
      name: formData.get("name"),
      author: formData.get("author"),
      category,
      price: Number(formData.get("price")),
      duration: formData.get("duration"),
      imageUrl: formData.get("imageUrl"),
      description: formData.get("description"),
      rating: Number(formData.get("rating")),
    };

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/add-books", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!res.ok) {
        throw new Error(`The books service responded with ${res.status}.`);
      }

      const data = await res.json();

      // Remember the new book in this browser so it shows up under My Books.
      if (data?.insertedId) {
        addMyBook(String(data.insertedId));
      }

      toast.success("Book added successfully!", {
        description: `${bookData.name} has been added to your BookNook library.`,
      });

      form.reset();
      setCategory("");
      setDraft(emptyDraft);
    } catch (error) {
      toast.error("Could not add book", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] px-4 py-6 transition-colors sm:px-6 sm:py-8 lg:px-10 dark:bg-[#141126]">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Page Header */}
        <div className="space-y-3">
          <Link
            href="/allbooks"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#5426B8] dark:text-white/60 dark:hover:text-[#C4B5FD]"
          >
            <ArrowLeft size={16} />
            Back to Books
          </Link>

          <div>
            <h1 className="flex items-start gap-2.5 text-xl font-bold tracking-tight text-[#19152B] sm:items-center sm:gap-3 sm:text-2xl lg:text-3xl dark:text-white">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F1EAFF] sm:size-10 dark:bg-[#8B5CF6]/15">
                <BookPlus
                  className="text-[#5426B8] dark:text-[#C4B5FD]"
                  size={22}
                />
              </span>
              Add New Book
            </h1>

            <p className="mt-2 text-sm text-[#6B7280] dark:text-white/60">
              Add a new book to your BookNook library.
            </p>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Form Card */}
          <Card className="gap-0 overflow-hidden rounded-2xl border border-[#EAE7F2] bg-white py-0 shadow-sm ring-0 dark:border-white/10 dark:bg-[#1F1A33]">
            <div className="border-b border-[#EAE7F2] px-4 py-4 sm:px-6 sm:py-5 dark:border-white/10">
              <CardTitle className="text-base font-semibold text-[#19152B] sm:text-lg dark:text-white">
                Book Information
              </CardTitle>
              <CardDescription className="mt-1 text-[#6B7280] dark:text-white/60">
                Fill in the details below to add a new book.
              </CardDescription>
            </div>

            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Book Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-[#19152B] dark:text-white/90"
                  >
                    Book Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={draft.name}
                    onChange={handleChange}
                    placeholder="Enter book name"
                    autoComplete="off"
                    className="h-11 rounded-xl border-[#E4DFF2] bg-white text-[#19152B] placeholder:text-[#9CA3AF] focus-visible:border-[#5426B8] focus-visible:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus-visible:border-[#8B5CF6]"
                    required
                  />
                </div>

                {/* Author and Category */}
                <div className="grid grid-cols-2  gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="author"
                      className="text-[#19152B] dark:text-white/90"
                    >
                      Author
                    </Label>
                    <Input
                      id="author"
                      name="author"
                      value={draft.author}
                      onChange={handleChange}
                      placeholder="Enter author name"
                      autoComplete="off"
                      className="h-11 rounded-xl border-[#E4DFF2] bg-white text-[#19152B] placeholder:text-[#9CA3AF] focus-visible:border-[#5426B8] focus-visible:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus-visible:border-[#8B5CF6]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-[#19152B] dark:text-white/90"
                    >
                      Category
                    </Label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value ?? "")}
                    >
                      <SelectTrigger
                        id="category"
                        className="h-11 w-full rounded-xl border-[#E4DFF2] bg-white text-[#19152B] data-placeholder:text-[#9CA3AF] dark:border-white/10 dark:bg-white/5 dark:text-white"
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-[#8B87A0] dark:text-white/45">
                      Click the field to see {CATEGORIES.length} categories.
                    </p>
                  </div>
                </div>

                {/* Price and Duration */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="price"
                      className="text-[#19152B] dark:text-white/90"
                    >
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={draft.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="Enter book price"
                      className="h-11 rounded-xl border-[#E4DFF2] bg-white text-[#19152B] placeholder:text-[#9CA3AF] focus-visible:border-[#5426B8] focus-visible:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus-visible:border-[#8B5CF6]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="duration"
                      className="text-[#19152B] dark:text-white/90"
                    >
                      Duration (Days)
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      value={draft.duration}
                      onChange={handleChange}
                      min="1"
                      placeholder="e.g. 14"
                      className="h-11 rounded-xl border-[#E4DFF2] bg-white text-[#19152B] placeholder:text-[#9CA3AF] focus-visible:border-[#5426B8] focus-visible:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus-visible:border-[#8B5CF6]"
                      required
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label
                    htmlFor="imageUrl"
                    className="text-[#19152B] dark:text-white/90"
                  >
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={draft.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/book-image.jpg"
                    className="h-11 rounded-xl border-[#E4DFF2] bg-white text-[#19152B] placeholder:text-[#9CA3AF] focus-visible:border-[#5426B8] focus-visible:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus-visible:border-[#8B5CF6]"
                    required
                  />
                  <p className="text-xs text-[#8B87A0] dark:text-white/45">
                    Paste a link and the cover shows up in the preview.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-[#19152B] dark:text-white/90"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
      
                    value={draft.description}
                    onChange={handleChange}
                    placeholder="Write a short description about this book..."
                    rows={5}
                    className="min-h-32 resize-none rounded-xl border-[#E4DFF2] bg-white text-[#19152B] placeholder:text-[#9CA3AF] focus-visible:border-[#5426B8] focus-visible:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus-visible:border-[#8B5CF6]"
                    required
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label
                    htmlFor="rating"
                    className="text-[#19152B] dark:text-white/90"
                  >
                    Rating (0 - 5)
                  </Label>

                  <div className="relative">
                    <Star
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500"
                    />
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={draft.rating}
                      onChange={handleChange}
                      placeholder="e.g. 4.8"
                      className="h-11 rounded-xl border-[#E4DFF2] bg-white pl-10 text-[#19152B] placeholder:text-[#9CA3AF] focus-visible:border-[#5426B8] focus-visible:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus-visible:border-[#8B5CF6]"
                      required
                    />
                  </div>
                </div>

                {/* Actions — sticky on mobile so the button stays visible */}
                <div className="sticky bottom-0 z-10 -mx-4 border-t border-[#EAE7F2] bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pt-6 dark:border-white/10 dark:bg-[#1F1A33]/95 sm:dark:bg-transparent">
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full rounded-xl border-[#E4DFF2] font-semibold text-[#19152B] hover:bg-[#F1EAFF] hover:text-[#5426B8] sm:w-auto dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      onClick={() => router.push("/dashboard/books")}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                  
                      disabled={loading}
                      className="h-11 w-full rounded-xl bg-gradient-to-r from-[#5426B8] to-[#8B5CF6] px-8 font-semibold text-white shadow-lg shadow-[#5426B8]/25 transition-all hover:from-[#451D96] hover:to-[#7C3AED] hover:shadow-[#5426B8]/40 active:translate-y-px disabled:opacity-70 sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Adding Book...
                        </>
                      ) : (
                        <>
                          <BookPlus size={17} />
                          Add Book
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Live Preview — reacts to the form and to the theme toggle */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#EAE7F2] bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-[#1F1A33]">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-[#19152B] dark:text-white">
                  <Eye size={16} className="text-[#5426B8] dark:text-[#C4B5FD]" />
                  Live preview
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F1EAFF] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#5426B8] uppercase dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]">
                  <Sparkles size={11} />
                  Draft
                </span>
              </div>

              {/* Cover */}
              <div className="mb-4 flex h-44 items-center justify-center overflow-hidden rounded-xl border border-[#EAE7F2] bg-[#F5F4FA] dark:border-white/10 dark:bg-white/5">
                {draft.imageUrl ? (
                  <div
                    role="img"
                    aria-label={draft.name || "Book cover preview"}
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${draft.imageUrl})` }}
                  />
                ) : (
                  <BookOpen
                    size={40}
                    className="text-[#C4B5FD] dark:text-white/25"
                  />
                )}
              </div>

              <h3 className="line-clamp-2 text-base font-semibold  text-[#19152B] dark:text-white">
                {draft.name || "Your book title"}
              </h3>
              <p className="mt-1 text-sm text-[#6B7280] dark:text-white/60">
                {draft.author || "Author name goes here"}
              </p>
              
              <p className="mt-2 line-clamp-2 text-base font-semibold  text-[#454055] dark:text-white">
                {draft.description || "Books description"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                    category
                      ? "bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]"
                      : "bg-[#F5F4FA] text-[#8B87A0] dark:bg-white/5 dark:text-white/40"
                  )}
                >
                  {category || "No category"}
                </span>
                  
                
              </div>
              <div className="mt-3 flex justify-between items-center p-2">
                <h3 className="line-clamp-2 text-base font-semibold  text-[#5426B8] dark:text-white">
                {`Price: ${draft.price}$` || "Book Duration"}
              </h3>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={cn(
                        i < Math.round(ratingValue)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-[#D8D4E4] dark:text-white/20"
                      )}
                    />
                  ))}
                  <span className="ml-1 text-xs font-medium text-[#6B7280] dark:text-white/60">
                    {ratingValue.toFixed(1)}
                  </span>
                </span>
              </div>

              <p className="mt-4 border-t border-[#EAE7F2] pt-3 text-xs text-[#8B87A0] dark:border-white/10 dark:text-white/45">
                Everything you type updates here, and the colours follow your
                theme toggle.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
