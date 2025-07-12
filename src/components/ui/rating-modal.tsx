import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  partnerName: string;
  skillLearned: string;
}

const RatingModal = ({ isOpen, onClose, onSubmit, partnerName, skillLearned }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, feedback);
      setRating(0);
      setFeedback("");
      onClose();
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-sm border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Rate Your Experience</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-white">How was your learning experience with {partnerName}?</Label>
            <p className="text-sm text-neutral-400 mt-1">Skill learned: {skillLearned}</p>
          </div>

          <div>
            <Label className="text-white mb-2 block">Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-neutral-400"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-neutral-400 mt-2">
              {rating === 0 && "Click to rate"}
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          <div>
            <Label htmlFor="feedback" className="text-white">Feedback (Optional)</Label>
            <Textarea
              id="feedback"
              placeholder="Share your experience with this skill swap..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} className="text-white border-white/20 hover:bg-white/10">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={rating === 0}
              className="bg-white text-black hover:bg-neutral-100 disabled:opacity-50"
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal; 