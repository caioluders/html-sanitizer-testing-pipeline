<?php

if (!function_exists('wp_allowed_protocols')) {
    function wp_allowed_protocols() {
        static $protocols = array(
            'http',
            'https',
            'ftp',
            'ftps',
            'mailto',
            'news',
            'irc',
            'irc6',
            'ircs',
            'gopher',
            'nntp',
            'feed',
            'telnet',
            'mms',
            'rtsp',
            'sms',
            'svn',
            'tel',
            'fax',
            'xmpp',
            'webcal',
            'urn'
        );
        return $protocols;
    }
}

if (!function_exists('_wp_specialchars')) {
    function _wp_specialchars($string, $quote_style = ENT_NOQUOTES, $charset = false, $double_encode = false) {
        $string = (string) $string;
        if (0 === strlen($string)) {
            return '';
        }
        if (empty($charset)) {
            $charset = 'UTF-8';
        }
        if (!$double_encode) {
            $string = htmlspecialchars_decode($string, $quote_style);
        }
        return htmlspecialchars($string, $quote_style, $charset, $double_encode);
    }
}

if (!function_exists('_deep_replace')) {
    function _deep_replace($search, $subject) {
        $subject = (string) $subject;

        $count = 1;
        while ($count) {
            $subject = str_replace($search, '', $subject, $count);
        }

        return $subject;
    }
}

if (!function_exists('wp_strip_all_tags')) {
    function wp_strip_all_tags($string, $remove_breaks = false) {
        $string = preg_replace('@<(script|style)[^>]*?>.*?</\\1>@si', '', $string);
        $string = strip_tags($string);

        if ($remove_breaks) {
            $string = preg_replace('/[\r\n\t ]+/', ' ', $string);
        }

        return trim($string);
    }
}

if (!function_exists('apply_filters')) {
    function apply_filters($tag, $value, ...$args) {
        // Simple implementation that just returns the value
        // In WordPress this would handle plugin filters, but we just need it to exist
        return $value;
    }
}

if (!function_exists('wp_kses_hook')) {
    function wp_kses_hook($data, $context = '') {
        return $data;
    }
}

if (!function_exists('wp_kses_version')) {
    function wp_kses_version() {
        return '4.9.9';
    }
}

if (!function_exists('wp_kses_normalize_entities')) {
    function wp_kses_normalize_entities($string) {
        // Replace characters with their HTML entities
        $string = preg_replace_callback('/&[^#;&]*;?/', '_wp_kses_decode_entities_chr', $string);
        $string = preg_replace_callback('/&#(x)?([0-9a-f]+);?/i', '_wp_kses_decode_entities_chr_hexdec', $string);
        return $string;
    }
}

if (!function_exists('_wp_kses_decode_entities_chr')) {
    function _wp_kses_decode_entities_chr($match) {
        $entity = $match[0];
        return html_entity_decode($entity);
    }
}

if (!function_exists('_wp_kses_decode_entities_chr_hexdec')) {
    function _wp_kses_decode_entities_chr_hexdec($match) {
        $entity = $match[0];
        return html_entity_decode($entity);
    }
}

if (!function_exists('did_filter')) {
    function did_filter($filter_name) {
        return false;
    }
}

if (!function_exists('has_filter')) {
    function has_filter($tag, $function_to_check = false) {
        return false;
    }
}

if (!function_exists('wp_parse_url')) {
    function wp_parse_url($url) {
        return parse_url($url);
    }
}

if (!function_exists('_wp_kses_split')) {
    function _wp_kses_split($string, $allowed_html, $allowed_protocols) {
        return wp_kses($string, $allowed_html, $allowed_protocols);
    }
}

if (!function_exists('wp_kses_no_null')) {
    function wp_kses_no_null($string) {
        $string = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $string);
        return $string;
    }
}

if (!function_exists('wp_kses_stripslashes')) {
    function wp_kses_stripslashes($string) {
        return stripslashes($string);
    }
}

if (!function_exists('wp_kses_decode_entities')) {
    function wp_kses_decode_entities($string) {
        return html_entity_decode($string, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('wp_check_invalid_utf8')) {
    function wp_check_invalid_utf8($string, $strip = false) {
        $string = (string) $string;
        if (0 === strlen($string)) {
            return '';
        }

        // Check for UTF-8 validity
        if (preg_match('/^./us', $string) === 1) {
            return $string;
        }

        // If strip is set, remove invalid UTF-8 characters
        if ($strip) {
            return preg_replace('/[\x00-\x08\x10\x0B\x0C\x0E-\x19\x7F]|[\x00-\x7F][\x80-\xBF]+|[\xC0\xC1][\x80-\xBF]|\xE0[\x80-\x9F][\x80-\xBF]|\xF0[\x80-\x8F][\x80-\xBF]{2}|[\xC2-\xDF]((?![\x80-\xBF])|[\x80-\xBF]{2,})|[\xE0-\xEF]((?![\x80-\xBF]{2})|[\x80-\xBF]{3,})|[\xF0-\xF7]((?![\x80-\xBF]{3})|[\x80-\xBF]{4,})|[\xF8-\xFB]((?![\x80-\xBF]{4})|[\x80-\xBF]{5,})|[\xFC-\xFD]((?![\x80-\xBF]{5})|[\x80-\xBF]{6,})|[\xFE\xFF][\x80-\xBF]*/', '', $string);
        }

        return '';
    }
} 