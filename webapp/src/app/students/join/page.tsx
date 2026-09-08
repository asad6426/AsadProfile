"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [currentJob, setCurrentJob] = useState("");
  const [workArea, setWorkArea] = useState("");
  const [availability, setAvailability] = useState("Open to work");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("নাম আবশ্যক / Name is required.");
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        fd.append("subdir", "students");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");
        imageUrl = uploadData.url;
      }

      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          currentJob,
          workArea,
          availability,
          bio,
          email,
          phone,
          image: imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className="max-w-md rounded-xl border border-border bg-background p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-foreground">ধন্যবাদ! Thank you!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            আপনার তথ্য জমা হয়েছে। যাচাই করার পর এটি পোর্টফোলিও সাইটে দেখানো হবে।
            <br />
            Your info has been submitted. It will appear on the site once reviewed.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted py-12">
      <div className="mx-auto max-w-xl px-4">
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-foreground">Add Your Info</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            আপনি যদি আমার প্রশিক্ষণার্থী হয়ে থাকেন, নিচের ফর্মটি পূরণ করুন। যাচাইয়ের পর আপনার
            তথ্য পোর্টফোলিও সাইটে দেখানো হবে।
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-primary/10">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    Photo
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handleImageChange}
                className="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
              />
            </div>

            <Field label="Name *">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-input"
                placeholder="আপনার পূর্ণ নাম"
              />
            </Field>

            <Field label="Address">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="field-input"
                placeholder="বর্তমান ঠিকানা"
              />
            </Field>

            <Field label="Current Job / Company">
              <input
                value={currentJob}
                onChange={(e) => setCurrentJob(e.target.value)}
                className="field-input"
                placeholder="যেমন: Software Engineer at XYZ Ltd."
              />
            </Field>

            <Field label="Work Area / Skills">
              <input
                value={workArea}
                onChange={(e) => setWorkArea(e.target.value)}
                className="field-input"
                placeholder="যেমন: Django, React, Data Science"
              />
            </Field>

            <Field label="Availability">
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="field-input"
              >
                <option>Open to work</option>
                <option>Open to freelance</option>
                <option>Currently employed, not looking</option>
                <option>Open to any opportunity</option>
              </select>
            </Field>

            <Field label="Short Bio">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="field-input min-h-24"
                placeholder="নিজের সম্পর্কে সংক্ষেপে লিখুন"
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-input"
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field-input"
                  placeholder="01XXXXXXXXX"
                />
              </Field>
            </div>

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
