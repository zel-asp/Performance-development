<?php

require_once __DIR__ . '/BaseModel.php';

class RateLimitModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('rate_limits');
    }
}
