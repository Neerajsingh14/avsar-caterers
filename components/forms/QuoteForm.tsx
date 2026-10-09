"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, MessageCircle, Phone } from "lucide-react";
import { enquirySchema, eventTypes, type EnquiryInput } from "@/lib/schemas";
import { business, whatsappLink } from "@/lib/business";
import DateRangePicker from "@/components/forms/DateRangePicker";

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/80">
        {label}
        {optional && <span className="text-white/40"> (optional)</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs text-[#ff8a6b]">
          {error}
        </span>
      )}
    </label>
  );
}

const slide = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.35 },
};

export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    defaultValues: {
      eventType: "",
      guests: "",
      eventStart: "",
      eventEnd: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      location: "",
      message: "",
      website: "",
    },
  });

  const eventType = watch("eventType");
  const eventStart = watch("eventStart") ?? "";
  const eventEnd = watch("eventEnd") ?? "";

  const next = async () => {
    const ok = await trigger(["eventType", "guests", "eventStart", "eventEnd"]);
    if (ok) setStep(1);
  };

  const onSubmit = async (values: EnquiryInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setStep(2);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (step === 0) {
      e.preventDefault();
      next();
    } else {
      handleSubmit(onSubmit)(e);
    }
  };

  const progress = step === 0 ? "50%" : "100%";

  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-card1 to-card2 p-6 shadow-2xl shadow-black/40 md:p-9">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden>
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent to-gold"
            animate={{ width: progress }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <form onSubmit={onFormSubmit} noValidate className="mt-8">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            {...register("website")}
          />

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" {...slide} className="space-y-6">
                <div className="text-center">
                  <h3 className="font-serif text-2xl text-white">Your event</h3>
                  <p className="mt-1 text-sm text-white/60">
                    Tell us what you are planning and how many guests to expect.
                  </p>
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm text-white/80">Event type *</legend>
                  <div role="radiogroup" className="flex flex-wrap gap-2">
                    {eventTypes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={eventType === t}
                        onClick={() => setValue("eventType", t, { shouldValidate: true })}
                        className={
                          "rounded-full border px-4 py-2.5 text-sm transition-colors " +
                          (eventType === t
                            ? "border-gold bg-gold text-[var(--color-on-accent)]"
                            : "border-white/15 text-white/75 hover:border-gold")
                        }
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {errors.eventType && (
                    <span role="alert" className="mt-1.5 block text-xs text-[#ff8a6b]">
                      {errors.eventType.message}
                    </span>
                  )}
                </fieldset>

                <Field label="Guest count *" error={errors.guests?.message}>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    placeholder="Enter expected guests"
                    aria-invalid={!!errors.guests}
                    className="field"
                    {...register("guests")}
                  />
                </Field>

                <div>
                  <span className="mb-2 block text-sm text-white/80">
                    Event dates <span className="text-white/40">(from &ndash; to, optional)</span>
                  </span>
                  <DateRangePicker
                    start={eventStart}
                    end={eventEnd}
                    error={errors.eventEnd?.message}
                    onChange={(s, e) => {
                      setValue("eventStart", s, { shouldValidate: true });
                      setValue("eventEnd", e, { shouldValidate: true });
                    }}
                  />
                  {errors.eventEnd && (
                    <span role="alert" className="mt-1.5 block text-xs text-[#ff8a6b]">
                      {errors.eventEnd.message}
                    </span>
                  )}
                </div>

                <button type="submit" className="btn-primary px-8 py-3.5 text-sm">
                  Next Step
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" {...slide} className="space-y-5">
                <div className="text-center">
                  <h3 className="font-serif text-2xl text-white">Client details</h3>
                  <p className="mt-1 text-sm text-white/60">
                    Share your details and our team will get in touch with menu ideas and pricing.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name *" error={errors.firstName?.message}>
                    <input type="text" autoComplete="given-name" placeholder="Enter first name" aria-invalid={!!errors.firstName} className="field" {...register("firstName")} />
                  </Field>
                  <Field label="Last name" optional error={errors.lastName?.message}>
                    <input type="text" autoComplete="family-name" placeholder="Enter last name" className="field" {...register("lastName")} />
                  </Field>
                  <Field label="Phone number *" error={errors.phone?.message}>
                    <input type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" aria-invalid={!!errors.phone} className="field" {...register("phone")} />
                  </Field>
                  <Field label="Email *" error={errors.email?.message}>
                    <input type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} className="field" {...register("email")} />
                  </Field>
                </div>

                <Field label="Event location *" error={errors.location?.message}>
                  <input type="text" placeholder="City, venue or locality" aria-invalid={!!errors.location} className="field" {...register("location")} />
                </Field>

                <Field label="Anything else we should know?" optional error={errors.message?.message}>
                  <textarea rows={3} placeholder="Menu preferences, number of functions, special requirements..." className="field resize-none" {...register("message")} />
                </Field>

                {serverError && (
                  <p role="alert" className="rounded-xl border border-[#ff8a6b]/40 bg-[#ff8a6b]/10 px-4 py-3 text-sm text-[#ffb09a]">
                    {serverError}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:border-gold"
                  >
                    Previous
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary px-8 py-3.5 text-sm">
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    {isSubmitting ? "Sending..." : "Submit Request"}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="py-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-gold text-[var(--color-on-accent)]"
                >
                  <Check size={32} strokeWidth={3} />
                </motion.div>
                <h3 className="mt-6 font-serif text-3xl text-white">Enquiry Received</h3>
                <p className="mt-3 text-white/80">Thank you for choosing Avsar Caterers.</p>
                <p className="mt-1 text-sm text-white/60">
                  Our team will contact you shortly to discuss your event.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary px-7 py-3.5 text-sm">
                    <MessageCircle size={16} /> WhatsApp Us
                  </a>
                  <a
                    href={business.phoneLink}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:border-gold"
                  >
                    <Phone size={16} /> Call Now
                  </a>
                  <a
                    href="#home"
                    onClick={() => {
                      reset();
                      setStep(0);
                    }}
                    className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm text-white/70 transition-colors hover:text-gold"
                  >
                    Back to Website
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}