// components/feedback-modal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null); // Pesan sukses/error

  const handleSubmit = async () => {
    if (rating === null || isSubmitting) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v3/submit-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) throw new Error();

      // Simpan ke localStorage
      localStorage.setItem("splitbill_last_rating", rating.toString());
      localStorage.setItem("splitbill_last_comment", comment);
      localStorage.setItem("splitbill_feedback_given", "true");

      // Tampilkan pesan sukses
      setMessage("Feedback kamu berhasil dikirim! Terima kasih!");
      
      // Opsional: tutup otomatis setelah 2 detik
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      setMessage("Gagal mengirim feedback. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        
        {/* Jika sudah ada pesan sukses/error */}
        {message ? (
          <div className="text-center py-4">
            <div className={`text-sm ${message.includes('berhasil') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-2">How was your experience?</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Help us improve by sharing your feedback.
            </p>

            {/* Rating */}
            <div className="flex justify-center mb-6 space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${
                    rating >= star
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-200"
                  }`}
                  disabled={isSubmitting}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Any suggestions or comments?"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none text-sm focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isSubmitting}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Not Now
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={rating === null || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}