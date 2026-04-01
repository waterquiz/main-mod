"use client";

import { useState } from "react";
import { Star, MessageSquarePlus } from "lucide-react";
import { Button } from "./ui/button";

interface Review {
  user: string;
  rating: number;
  text: string;
}

export function ReviewsList({ initialReviews, appId }: { initialReviews: Review[], appId: string }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [expanded, setExpanded] = useState(false);
  const [newRevUser, setNewRevUser] = useState("");
  const [newRevRating, setNewRevRating] = useState("5");
  const [newRevText, setNewRevText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // When submitting review
  const handleAddReview = async () => {
    if (!newRevUser.trim() || !newRevText.trim() || !appId) return;
    setIsSubmitting(true);
    
    // Add to top of the reviews list so latest is seen first
    const newReview = { user: newRevUser, rating: Number(newRevRating), text: newRevText };
    const updatedReviews = [newReview, ...reviews];
    
    // Optimistic UI update
    setReviews(updatedReviews);
    setNewRevUser("");
    setNewRevText("");
    setNewRevRating("5");
    setShowForm(false);
    
    try {
      await fetch('/api/apps', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, reviews: updatedReviews })
      });
    } catch (error) {
      console.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayReviews = expanded ? reviews : reviews.slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-xl font-bold">User Reviews</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowForm(!showForm)} 
          className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-[#3DDC84]/50"
        >
          <MessageSquarePlus className="w-4 h-4 mr-2" /> Write a Review
        </Button>
      </div>

      {showForm && (
        <div className="bg-black/5 dark:bg-white/5 p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10 space-y-4 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-sm">Leave a Review</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input 
              type="text" 
              value={newRevUser} 
              onChange={e => setNewRevUser(e.target.value)} 
              placeholder="Your Name" 
              className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50 sm:col-span-1" 
              required
            />
            <div className="relative sm:col-span-1">
              <select 
                value={newRevRating} 
                onChange={e => setNewRevRating(e.target.value)} 
                className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50 appearance-none"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500 text-xs">★</div>
            </div>
            
            <input 
              type="text" 
              value={newRevText} 
              onChange={e => setNewRevText(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleAddReview()}
              placeholder="What do you think about this app?" 
              className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3DDC84]/50 sm:col-span-2" 
              required
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleAddReview} 
              disabled={isSubmitting || !newRevUser.trim() || !newRevText.trim()} 
              className="bg-[#3DDC84] hover:bg-[#3DDC84]/80 text-black font-bold h-10 px-6 rounded-xl"
            >
              {isSubmitting ? "Posting..." : "Post Review"}
            </Button>
          </div>
        </div>
      )}

      {!reviews || reviews.length === 0 ? (
        <div className="bg-black/5 dark:bg-white/5 p-6 rounded-xl text-center border border-black/5 dark:border-white/5">
          <p className="text-sm text-foreground/60 italic">No reviews yet for this app. Be the first to review!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayReviews.map((rev, i) => (
              <div key={i} className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#3DDC84]/20 text-[#3DDC84] font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                    {rev.user?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{rev.user}</p>
                    <div className="flex text-yellow-500 mt-0.5">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star 
                          key={starIdx} 
                          className={`w-3.5 h-3.5 ${starIdx < rev.rating ? "fill-current" : "text-foreground/20"}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed font-medium">{rev.text}</p>
              </div>
            ))}
          </div>

          {reviews.length > 2 && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setExpanded(!expanded)} 
              className="w-full mt-4 font-bold border-black/10 dark:border-white/10 hover:border-[#3DDC84]/50 hover:bg-[#3DDC84]/10 hover:text-[#3DDC84]"
            >
              {expanded ? "Show Less" : "View All Reviews"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
