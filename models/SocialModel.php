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
        return (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];
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
        $reactions = $post['reactions'] ?? ['clap' => 0, 'heart' => 0, 'star' => 0, 'fire' => 0];
        if (isset($reactions[$reactionType])) {
            $reactions[$reactionType]++;
        } else {
            $reactions[$reactionType] = 1;
        }

        $updateRes = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'PATCH', [
            'reactions' => $reactions
        ]);
        return isset($updateRes['status']) && ($updateRes['status'] >= 200 && $updateRes['status'] < 300);
    }

    public function addComment(string $postId, array $comment): bool
    {
        $res = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'GET');
        if (empty($res['data'][0])) {
            return false;
        }

        $post = $res['data'][0];
        $comments = $post['comments'] ?? [];
        $comments[] = array_merge([
            'id' => 'comment-' . uniqid(),
            'created_at' => date('c')
        ], $comment);

        $updateRes = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'PATCH', [
            'comments' => $comments
        ]);
        return isset($updateRes['status']) && ($updateRes['status'] >= 200 && $updateRes['status'] < 300);
    }

    public function getShiftSentiments(): array
    {
        $res = supabaseRequest('shift_sentiments?order=created_at.desc', 'GET');
        return (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];
    }

    public function logShiftSentiment(array $data): bool
    {
        if (empty($data['id'])) {
            $data['id'] = 'sentiment-' . time();
        }
        $data['created_at'] = date('c');
        $res = supabaseRequest('shift_sentiments', 'POST', $data);
        return isset($res['status']) && ($res['status'] >= 200 && $res['status'] < 300);
    }
}
