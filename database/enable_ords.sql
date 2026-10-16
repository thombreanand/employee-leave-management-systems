-- Run as LEAVE_APP after ORDS has been installed/configured.
BEGIN
 ORDS.ENABLE_OBJECT(p_enabled=>TRUE,p_schema=>USER,p_object=>'LEAVE_REQUESTS',p_object_type=>'TABLE',p_object_alias=>'leave_requests',p_auto_rest_auth=>FALSE);
 COMMIT;
END;
/
