<?php
require_once __DIR__ . '/BaseModel.php';

class SocialModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('social_recognitions');
    }

    public function getRecognitions(): array
    {
        $res = supabaseRequest('social_recognitions?order=created_at.desc', 'GET');
        $recognitions = (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];
        if (empty($recognitions)) {
            $this->seedInitialRecognitions();
            $res = supabaseRequest('social_recognitions?order=created_at.desc', 'GET');
            $recognitions = (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];
        }
        return $recognitions;
    }

    public function createRecognition(array $data): bool
    {
        if (empty($data['id'])) {
            $data['id'] = 'post-' . time();
        }
        if (!isset($data['reactions'])) {
            $data['reactions'] = ['clap' => 0, 'heart' => 0, 'star' => 0, 'fire' => 0];
        }
        $data['created_at'] = date('c');

        $res = supabaseRequest('social_recognitions', 'POST', $data);
        return isset($res['status']) && ($res['status'] >= 200 && $res['status'] < 300);
    }

    public function addReaction(string $postId, string $reactionType): bool
    {
        $res = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'GET');
        if (empty($res['data'][0])) {
            return false;
        }

        $post = $res['data'][0];
        $reactions = is_array($post['reactions'] ?? null) ? $post['reactions'] : ['clap' => 0, 'heart' => 0, 'star' => 0, 'fire' => 0];
        if (!isset($reactions[$reactionType])) {
            $reactions[$reactionType] = 0;
        }
        $reactions[$reactionType]++;

        $patchRes = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'PATCH', [
            'reactions' => $reactions
        ]);
        return isset($patchRes['status']) && ($patchRes['status'] >= 200 && $patchRes['status'] < 300);
    }

    public function getShiftSentiments(): array
    {
        $res = supabaseRequest('shift_sentiments?order=created_at.desc', 'GET');
        return (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];
    }

    public function logShiftSentiment(array $data): bool
    {
        if (empty($data['id'])) {
            $data['id'] = 'sent-' . time();
        }
        $data['created_at'] = date('c');

        $res = supabaseRequest('shift_sentiments', 'POST', $data);
        return isset($res['status']) && ($res['status'] >= 200 && $res['status'] < 300);
    }

    private function seedInitialRecognitions(): void
    {
        $initial = [
            [
                'id'             => 'post-101',
                'sender_id'      => 'emp-105',
                'sender_name'    => 'Elena Vance',
                'sender_role'    => 'HR Director & Master Trainer',
                'sender_type'    => 'Supervisor',
                'sender_avatar'  => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                'receiver_id'    => 'emp-101',
                'receiver_name'  => 'Maria Santos',
                'receiver_role'  => 'Front Desk Host',
                'receiver_dept'  => 'Front Office',
                'receiver_avatar'=> 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'category_key'   => 'crisis_recovery',
                'category_label' => 'Crisis & Conflict Recovery',
                'points_awarded' => 100,
                'text_content'   => 'Exceptional de-escalation during the diplomat delegation arrival. Maria calmly arranged executive lounge hospitality and VIP suite keys without friction.',
                'reactions'      => ['clap' => 14, 'heart' => 9, 'star' => 7, 'fire' => 5]
            ],
            [
                'id'             => 'post-102',
                'sender_id'      => 'emp-102',
                'sender_name'    => 'Carlos Gomez',
                'sender_role'    => 'Concierge Lead',
                'sender_type'    => 'Peer',
                'sender_avatar'  => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'receiver_id'    => 'emp-101',
                'receiver_name'  => 'Maria Santos',
                'receiver_role'  => 'Front Desk Host',
                'receiver_dept'  => 'Front Office',
                'receiver_avatar'=> 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'category_key'   => 'collaboration',
                'category_label' => 'Team Collaboration',
                'points_awarded' => 50,
                'text_content'   => 'Huge thanks to Maria for stepping in during the concierge group luggage dispatch while two flight buses arrived simultaneously. Pure teamwork!',
                'reactions'      => ['clap' => 8, 'heart' => 12, 'star' => 3, 'fire' => 2]
            ],
            [
                'id'             => 'post-103',
                'sender_id'      => 'emp-103',
                'sender_name'    => 'Chef Marco Rossi',
                'sender_role'    => 'Executive Sous Chef',
                'sender_type'    => 'Supervisor',
                'sender_avatar'  => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
                'receiver_id'    => 'emp-104',
                'receiver_name'  => 'Chef Marco S.',
                'receiver_role'  => 'Line Cook Lead',
                'receiver_dept'  => 'Culinary',
                'receiver_avatar'=> 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80',
                'category_key'   => 'safety_haccp',
                'category_label' => 'Safety & HACCP Standard',
                'points_awarded' => 100,
                'text_content'   => 'Flawless 100% cold-chain probe log compliance and exemplary allergen segregation during banquet dinner service for 250 guests.',
                'reactions'      => ['clap' => 19, 'heart' => 6, 'star' => 8, 'fire' => 11]
            ]
        ];

        foreach ($initial as $post) {
            supabaseRequest('social_recognitions', 'POST', $post);
        }
    }
}
